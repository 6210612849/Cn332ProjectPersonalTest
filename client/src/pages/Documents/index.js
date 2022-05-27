import ListGroup from "react-bootstrap/ListGroup";
import Badge from "react-bootstrap/Badge";
import React, { useContext, useCallback, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { getFeature, postFeature } from "../../utils/sdk";
import { Comment } from "../../components";
import { Label } from "reactstrap";

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
import "../../App.css";



const getProjects = () => getFeature("create_project/");
const getSearchedProjects = (title) => getFeature(`search/projects/?search=${title}`)


const Documents = () => {

  let history = useHistory();

  const [samplePost, setSamplePost] = useState([])
  const [inputs, setInputs] = useState({});
  const [searchedProjects, setSearchedProjects] = useState([])
  const [searchForm, setSearchForm] = useState({ title: "" })

  useEffect(() => {
    console.log("call useEff")
    getSearchedProjects(searchForm.title).then((resp) => {
      setSearchedProjects(resp.data);

    });
    console.log(samplePost)
  }, [searchForm]);

  const handleSearchForm = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setSearchForm((values) => ({ ...values, [name]: value }));
    console.log("title")
    console.log(searchForm.title)
    console.log("title")
  }


  return (
    <Container className='justify-content-md-center'>
      <h1>Searched projects</h1>
      <Row>
        <Col md="7">
          <ListGroup as="ol" numbered>
            {searchedProjects.map((project, index) => (

              <ListGroup.Item
                as="li"
                className="d-flex justify-content-between align-items-start justify-content-end"
                key={index}
              >
                <div className="ms-2 me-auto">
                  {/* 'id','title','status','owner','adviser','Facility','File_url','Detail' */}
                  <div className="fw-bold">{project.title}</div>

                  <label>{project.body}</label><br></br>
                  <label>{project.owner}</label><br></br>
                  <label>this is id {project.id}</label><br></br>
                  <label>this is status {project.status}</label><br></br>
                  <label>this is owneer id{project.owner}</label><br></br>
                  <label>this is adviser {project.adviser}</label><br></br>
                  <label>this is Facility {project.Facility}</label><br></br>
                  <label>this is file {project.File_url}</label><br></br>
                  <label>this is detail {project.Detail}</label><br></br>

                </div>

              </ListGroup.Item>
            )
            )}
          </ListGroup>
        </Col>

        <Col md="3">
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


    </Container>

  );
}


export default Documents;
