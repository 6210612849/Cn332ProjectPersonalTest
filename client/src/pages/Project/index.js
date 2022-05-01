
import { Container, Row, Col, Button, Image, ListGroup, ListGroupItem } from 'react-bootstrap'
import React, { useContext, useCallback, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { getUser, getFeature, postUserm, putUser, postFeature } from "../../utils/sdk";


import { storage } from '../../utils/firebase';
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";


import { LOGIN_URL } from "../../config/urls";
import { useUserRequired } from "../../utils/hooks";
import { MiniProfile, Schedule, UserContext } from "../../components";

import { logout, todo, updatetodo } from "../../pages/Home/sdk";
import { Label } from 'reactstrap';
import { memo } from 'react';
import { textAlign, unstable_getThemeValue } from '@mui/system';

/* must contain 
        progress manage,
        project detail,

        have 2 type permission
        1. owner -> add progress
        2. advisor -> comment progress
        3. visiter -> none of above


        require
        ต้องการให้ project สามารถส่ง id ของ progress ของ project ทั้งหมดนี้มาได้ทุกอันมาได้
        ต้องการให้เวลาส่ง progression สามารถส่ง id review ของ progress มาได้


*/

//const updateProfile = (sample) => putUser("users/testPUT/", sample);
const get_project = (project_id) => getFeature(`project/${project_id}/`);
const get_prog = (prog_id) => getFeature(`progress/${prog_id}/`);
const get_posts = (postsId) => getFeature(`posts/${postsId}`)
const get_review = (review_id) => getFeature(`reviews/${review_id}`)

const post_prog = (data) => postFeature("progress/", data);
const post_review = (data) => postFeature("reviews/", data);



const Project = () => {


    useUserRequired();

    const [project, setProject] = useState({});

    const [posts, setPosts] = useState();
    const [url, setUrl] = useState("");

    const history = useHistory();
    const { user, setUser } = useContext(UserContext);


    useEffect(() => {
        get_project(3).then((resp) => {
            setProject(resp.data);

        });

    }, []);

    console.log(project)

    return (
        <Container>
            <Row md="6">
                <Col md="8">
                    <h1>Project Detail</h1>
                    <Label>
                        project id: {project.id}
                        project owner id: {project.owner}
                        project adviser id: {project.adviser}
                        project status: {project.status}
                        project detail: {project.Detail}
                    </Label>

                    <Prog progs={project.progress} />
                </Col>

                <Col md="2">
                    <ProgressForm user={user} project={project} />
                </Col>

            </Row>

        </Container>


    )
}

const Prog = (props) => {

    const [progress, setProgress] = useState([]);
    const [getValue, setGetValue] = useState(true);
    var prog_list = props.progs

    function test(prog) {

        for (var p in prog) {
            console.log("hi")
            console.log(p)
            console.log(prog[p])

            get_prog(parseInt(prog[p])).then((resp) => {
                console.log("datas")
                console.log(resp.data)
                setProgress(prev => [...prev, (resp.data)]);
            });
        }

    }
    useEffect(() => {
        test(prog_list)
        setGetValue(prev => !prev)
    }, [prog_list])

    return (
        <>
            <h1>progress</h1>
            <ListGroup>
                {
                    progress.map((p, index) => {
                        return (
                            <>
                                <ListGroupItem>
                                    <Row>
                                        <Col md="7">
                                            <h3>Title: {p.title}</h3>
                                            detail: {p.description} owner: {p.owner} timestamp: {p.timestamp}

                                            <h3>Review</h3>
                                            <ListGroup>
                                                {p.review.map((r, index) => {
                                                    return (
                                                        <Review id={r}></Review>
                                                    )
                                                })}
                                            </ListGroup>
                                        </Col>
                                        <Col md="2">
                                            <ReviewForm id={p.id} />
                                        </Col>

                                    </Row>

                                </ListGroupItem>
                            </>
                        )
                    }
                    )
                }
            </ListGroup>
        </>
    )
}

const Review = (props) => {
    var review_id = props.id
    const [review, setReview] = useState({})

    useEffect(() => {
        get_review(review_id).then((resp) => {
            setReview(resp.data);

        });
    }, [])

    return (
        <>
            <ListGroupItem>
                detail: {review.comments} status: {review.status} by {review.owner} timestamp: {review.timestamp}
            </ListGroupItem>
        </>
    )
}



const ProgressForm = (props) => {

    const [progress, setProgress] = useState({});

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setProgress((values) => ({ ...values, [name]: value }));
    };

    const handleCreateProgress = (event) => {
        event.preventDefault();

        const data = {
            owner: props.user.id,
            project: props.project.id,
            title: progress.title,
            description: progress.description,
            review: [],

        };

        post_prog(data);
        console.log("create progress done")

    };
    return (
        <>
            <form onSubmit={handleCreateProgress}>
                <h1>Update Progress</h1>
                <Label>Title:

                    <input
                        type="text"
                        name="title"
                        value={progress.title || ""}
                        onChange={handleChange}
                    />
                </Label>

                <Label>
                    Description:
                    <input
                        type="textfield"
                        name="description"
                        size=""
                        value={progress.description || ""}
                        onChange={handleChange}
                    />
                </Label>
                <input type="submit" />
            </form>

        </>
    );
}

const ReviewForm = (props) => {
    var prog_id = props.id

    useUserRequired();
    const { user, setUser } = useContext(UserContext);
    const [review, setReview] = useState({});

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        //console.log(inputs.description);
        setReview((values) => ({ ...values, [name]: value }));
        //console.log("after change" + inputs.description);
    };

    const handleCreateProgress = (event) => {
        event.preventDefault();

        const data = {
            owner: user.id,
            progress: prog_id,
            status: review.status,
            comments: review.comments,

        };
        console.log(data)
        post_review(data);
        console.log("create done")

    };
    return (
        <>
            review form
            <form onSubmit={handleCreateProgress}>

                <Label>
                    comment:
                    <input
                        type="text"
                        name="comments"
                        onChange={handleChange}
                    />
                </Label>
                <Label>
                    status:
                    <select name="status" value={review.status || ""} onChange={handleChange}>
                        <option value="Unknown">Unknown</option>
                        <option value='A'>Approved</option>
                        <option value='R'>Rejected</option>
                    </select>
                </Label>
                <input type="submit" />
            </form>

        </>
    );
}

export default Project;