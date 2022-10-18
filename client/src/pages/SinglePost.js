import React, {useContext} from "react";
import gql from "graphql-tag";
import { useQuery } from '@apollo/react-hooks';
import { Button, Card, Grid, Icon, Image, Label } from "semantic-ui-react";

import { AuthContext } from '../context/auth'
import LikeButton from "../components/LikeButton";
import DeleteButton from "../components/DeleteButton";

function SinglePost(props) {
    const postId = props.match.params.postId;
    const {user} = useContext(AuthContext);
    console.log(postId);

    const { data: { getPost }} = useQuery(FETCH_POST_QUERY, {
        variables: {
            postId
        }
    });

    function deletePostCallback(){
        props.history.push('/')
    }

    let postMarkup;
    if(!getPost){
        postMarkup = <p>Loading Yak....</p>
    } else {
        const { id, body, createdAt, username, comments, likes, likeCount, commentCount } = getPost;

        postMarkup = (
            <Grid.Row>
                <Grid.Column width={2}>
                <Image 
                src='https://react.semantic-ui.com/images/avatar/large/molly.png'
                size="small"
                float="right"/>
                </Grid.Column>
                <Grid.Column width={10}>
                <Card fluid>
                    <Card.Content>
                        <Card.Header>{username}</Card.Header>
                        <Card.Meta>{createdAt}</Card.Meta>
                        <Card.Description>{body}</Card.Description>
                    </Card.Content>
                    <hr/>
                    <Card.Content extra>
                        <LikeButton user={user} post={{ id, likeCount, likes }}/>
                        <Button
                            as="div"
                            labelPosition="right"
                            onClick={() => console.log('Comment on Yak')}
                            >
                                <Button basic color="blue">
                                    <Icon name="comments"/>
                                </Button>
                                <Label basic color="blue" pointing="left">
                                    {commentCount}
                                </Label>
                            </Button>
                            {/* if logged in user matches user that created the post, render delete button */}
                            {user && user.username === username && (
                                <DeleteButton postId={id} callback={deletePostCallback} />
                            )}
                    </Card.Content>
                </Card>
                </Grid.Column>
            </Grid.Row>
        )
    }
    return postMarkup;
}

const FETCH_POST_QUERY = gql`
    query($postId: ID!){
        getPost(postId: $postId){
            id 
            body 
            createdAt 
            username 
            likeCount
            likes{
                username
            }
            commentCount
            comments{
                id 
                username 
                createdAt 
                body
            }
        }
    }
`

export default SinglePost;



