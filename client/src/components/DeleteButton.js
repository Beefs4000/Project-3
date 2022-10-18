import React, { useState } from "react";
import gql from "graphql-tag";
import { useMutation } from '@apollo/react-hooks';
import { Button, Confirm, Icon } from 'semantic-ui-react';

import { FETCH_POSTS_QUERY } from '../util/grapgql';

function DeleteButton({ postId, callback }) {
    const [confirmOpen, setConfirmOpen] = useState(false);

    // 
    const [deletePost] = useMutation(DELETE_POST_MUTATION, {
        update(proxy) {
            setConfirmOpen(false);
            // getting post data
            const data = proxy.readQuery({
                query: FETCH_POSTS_QUERY
            });
            // remove a post by filtering and keeping all posts that do not match this id
            data.getPosts = data.getPosts.filter(p => p.id !== postId);
            proxy.writeQuery({ query: FETCH_POSTS_QUERY, data });
            if (callback) callback();
        },
        variables: {
            postId
        }
    })
    return (
        <>
            <Button as="div" color="red" floated='right' onClick={() => setConfirmOpen(true)}>
                <Icon name="trash" style={{ margin: 0 }} />
            </Button>
            {/* This askes the user to confirm deletion, clicks no closes the model without changing anything. 
            Clicking confirm runs the delete post mutation */}
            <Confirm
                open={confirmOpen}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={deletePost}
            />
        </>

    )
}

const DELETE_POST_MUTATION = gql`
    mutation deletePost($postId: ID!){
        deletePost(postId: $postId)
    }
`

export default DeleteButton;