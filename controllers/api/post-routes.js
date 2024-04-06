//packages and models that we'll need to create the Express.js API endpoints
const router = require("express").Router();
const sequelize = require("../../config/connection");
const { Post, User, Vote, Comment } = require("../../models"); //Why did we include the User model for the post-routes? In a query to the post table, we would like to retrieve not only information about each post, but also the user that posted it. With the foreign key, user_id, we can form a JOIN, an essential characteristic of the relational data model.
const withAuth = require("../../utils/auth");

//get all users /api/posts
router.get("/", (req, res) => {
  console.log("================================");
  Post.findAll({
    order: [["created_at", "DESC"]], //Notice that the order property is assigned a nested array that orders by the created_at column in descending order. This will ensure that the latest posted articles will appear first.
    //Query configuration
    attributes: [
      "id",
      "post_url",
      "title",
      "created_at",
      [
        sequelize.literal(
          "(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)"
        ),
        "vote_count",
      ], //include the total vote count for a post
    ], //  configure the findAll method by customizing the attributes property (account for the other columns that we'll retrieve in this query).
    include: [
      //we'll include the JOIN to the User table. We do this by adding the property include (include property is expressed as an array of objects. To define this object, we need a reference to the model and attributes)
      {
        model: User,
        attributes: ["username"], //  username attribute was nested in the user object, which designates the table where this attribute is coming from
      },
      {
        model: Comment,
        attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
        include: {
          model: User,
          attributes: ["username"],
        },
      },
    ],
  })
    //Now that the query is done, we need to create a Promise that captures the response from the database call
    .then((dbPostData) => res.json(dbPostData))
    .catch((err) => {
      res.status(500).json(err);
    });
});

// Get a single post /api/ post/ :id
router.get("/:id", (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id,
    },
    attributes: [
      "id",
      "post_url",
      "title",
      "created_at",
      [
        sequelize.literal(
          "(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)"
        ),
        "vote_count",
      ],
    ],
    include: [
      {
        model: User,
        attributes: ["username"],
      },
      {
        model: Comment,
        attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
        include: {
          model: User,
          attributes: ["username"],
        },
      },
    ],
  })
    .then((dbPostData) => {
      if (!dbPostData) {
        res.status(404).json({ message: "No post found with this id" });
        return;
      }
      res.json(dbPostData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

//Create a post
router.post("/", withAuth, (req, res) => {
  //expects {title: 'Taskmaster goes public!', post_url: 'https://taskmaster.com/press', user_id: 1}}
  Post.create({
    title: req.body.title,
    post_url: req.body.post_url,
    user_id: req.session.user_id,
  })
    .then((dbPostData) => res.json(dbPostData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// PUT /api/posts/upvote - Make sure this PUT route is defined before the /:id PUT route, though. Otherwise, Express.js will think the word "upvote" is a valid parameter for /:id.
router.put("/upvote", withAuth, (req, res) => {
  // custom static method created in models/Post.js
  if (req.session) {
    Post.upvote(
      { ...req.body, user_id: req.session.user_id },
      { Vote, Comment, User }
    )
      .then((updatedVoteData) => res.json(updatedVoteData))
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  }
});

//Update a posts title -In the response, we sent back data that has been modified and stored in the database
router.put("/:id", withAuth, (req, res) => {
  Post.update(
    {
      title: req.body.title, //the req.body.title value to replace the title of the post
    },
    {
      where: {
        id: req.params.id, //we used the request parameter to find the post
      },
    }
  )
    .then((dbPostData) => {
      if (!dbPostData[0]) {
        res.status(404).json({ message: "No post found with this id" });
        return;
      }
      res.json(dbPostData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// Delete a post - We will use Sequelize's destroy method and using the unique id in the query parameter to find then delete this instance of the post
router.delete("/:id", withAuth, (req, res) => {
  Post.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((dbPostData) => {
      if (!dbPostData) {
        res.status(404).json({ message: "No post found with this id" });
        return;
      }
      res.json(dbPostData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});
// In order to test this route, we need to expose the changes to the router by using the following Express.js
module.exports = router;
