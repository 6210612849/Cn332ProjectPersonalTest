import ListGroup from "react-bootstrap/ListGroup";
import Badge from "react-bootstrap/Badge";
import React, { useContext, useCallback, useState, useEffect } from "react";
import { useHistory, Link, useParams } from "react-router-dom";
import { getFeature, postFeature } from "../../utils/sdk";
import { Comment, UserContext } from "../../components";

import {
  Navbar,
  Nav,
  NavDropdown,
  Col,
  Row,
  Image,
  Button,
  Tabs,
  Container,
} from "react-bootstrap";
//import "bootstrap/dist/css/bootstrap.min.css";
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../Dashboard/App.css";
import { Label } from "reactstrap";
import { useUserRequired } from "../../utils/hooks";



const getPost = () => getFeature("posts/");
const getSearchedPost = (title) => getFeature(`search/?search=${title}`)

const post_POST = (data) => postFeature("create_post/", data);
const getComment = () => getFeature("comments/<int:pk>/");

const Dashboard = () => {
  useUserRequired();

  let history = useHistory();

  const [samplePost, setSamplePost] = useState([])
  const { user, setUser } = useContext(UserContext);
  const [isStudent, setIsStudent] = useState(false);
  const [searchedPost, setSearchedPost] = useState([]);
  const [searchForm, setSearchForm] = useState({});

  useEffect(() => {
    getPost().then((resp) => {
      setSamplePost(resp.data);

    });

    getSearchedPost(searchForm.title).then((resp) => {
      setSearchedPost(resp.data);

    });

    if (user) {
      //console.log("hello")
      if (user.status == 'S') {
        setIsStudent((prev) => (!prev))
      }

      //setIsStudent(prev => !prev)
    }


  }, [searchForm])


  const handleSearchForm = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    //console.log(inputs.description);
    setSearchForm((values) => ({ ...values, [name]: value }));
    //console.log("after change" + inputs.description);
  }

  console.log(isStudent)

  console.log("search")
  console.log(searchedPost)
  console.log("search done")

  function lower(obj) {
    var i = 0;
    for (var prop in obj) {
      var test_first_name = (((obj[prop].options)[i]).first_name);
      var test_last_name = (((obj[prop].options)[i]).last_name);

      (((obj[prop].options)[i]).first_name) = test_first_name.charAt(0).toUpperCase() + test_first_name.slice(1).toLowerCase();
      (((obj[prop].options)[i]).last_name) = test_last_name.charAt(0).toUpperCase() + test_last_name.slice(1).toLowerCase();

    }
    i++;
  }


  console.log(samplePost)
  lower(samplePost);

  function testclick(event) {
    console.log("you clicked")
  }

  // const convertTextToLowerCase = () => {
  //   // To convert Lower Case
  //   let lowerCaseText = defaultText.toLowerCase();
  //   setDefaultText(lowerCaseText);
  // };


  return (
    <body style={{ backgroundColor: "#edf1f5" }}>
      <Container >
        <Row>
          <Col md="7">
            <div className="home">
              <div className="feed_warp">
                {searchedPost.map((post, index) =>
                (
                  <div className="dashboard_bar">
                    {
                      post.options.map((post_1, index) => (

                        <div className="activity-entry ">

                          <div className="wrap">
                            <div className="list">

                              <div className="dashboard_pic" style={{ backgroundImage: `url(${post_1.avatar})` }}
                              />
                              <div className="details">
                                <Link className="name" to={`/ProfileView/${post_1.id}`}>

                                  <span className="first_name">
                                    {post_1.first_name}
                                  </span>
                                  <span className="last_name">
                                    {post_1.last_name}
                                  </span>

                                </Link>
                                <div className="comment_body">
                                  {post.body}
                                </div>
                                <div className="tags_body">
                                  {post.tags.map((tag, index) => (

                                    <Link key={`${tag}-index`} onClick={testclick()}
                                      to={`/DashboardView/tags/${tag}`}>
                                      <li className="d-inline tag-name"
                                        value={tag}>
                                        {tag}
                                      </li>
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                      )
                    }
                  </div>
                )
                )
                }
              </div>
            </div>
          </Col>
          <Col md="2">

            <PostForm />

            <Label>Search :
              <input
                type="text"
                name="title"
                value={searchForm.title || ""}
                onChange={handleSearchForm}
              />
            </Label>
          </Col>
        </Row>

      </Container >

    </body >
  );
}

const PostForm = () => {

  const [postForm, setPostForm] = useState({});

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    //console.log(inputs.description);
    setPostForm((values) => ({ ...values, [name]: value }));
    //console.log("after change" + inputs.description);
  };

  const handleCreatePost = (event) => {
    event.preventDefault();
    const data = {
      title: postForm.title,
      body: postForm.description,

    };
    console.log(data);
    post_POST(data).then(() => {
      getPost().then((resp) => {
        setPostForm(resp.data);

      });
      console.log("created")
      console.log(data)
    });


  };
  return (
    <>
      <form onSubmit={handleCreatePost}>
        <h1>Create post</h1>
        <Label>Title:

          <input
            type="text"
            name="title"
            value={postForm.title || ""}
            onChange={handleChange}
          />
        </Label>

        <Label>Description:

          <input
            type="text"
            name="body"
            value={postForm.body || ""}
            onChange={handleChange}
          />
        </Label>


        <input type="submit" />
      </form>
    </>
  )
}

export default Dashboard;
