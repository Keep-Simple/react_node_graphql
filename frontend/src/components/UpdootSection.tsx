import React, { useState } from 'react'
import { Flex, IconButton } from '@chakra-ui/core'
import { PostSnippetFragment, useVoteMutation } from '../generated/graphql'

interface UpdootSectionProps {
    post: PostSnippetFragment
}

type UpdootStates = 'updoot-loading' | 'downdoot-loading' | 'not-loading'

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
    const [, vote] = useVoteMutation()

    const [loadingState, setLoadingState] = useState<UpdootStates>(
        'not-loading'
    )

    return (
        <Flex
            direction="column"
            justifyContent="center"
            alignItems="center"
            mr={4}
        >
            <IconButton
                onClick={async () => {
                    if (post.voteStatus === 1) return

                    setLoadingState('updoot-loading')
                    await vote({
                        postId: post.id,
                        value: 1,
                    })
                    setLoadingState('not-loading')
                }}
                variantColor={post.voteStatus === 1 ? 'green' : undefined}
                isLoading={loadingState === 'updoot-loading'}
                aria-label="updoot post"
                icon="chevron-up"
            />
            {post.points}
            <IconButton
                onClick={async () => {
                    if (post.voteStatus === -1) return

                    setLoadingState('downdoot-loading')
                    await vote({
                        postId: post.id,
                        value: -1,
                    })
                    setLoadingState('not-loading')
                }}
                variantColor={post.voteStatus === -1 ? 'red' : undefined}
                isLoading={loadingState === 'downdoot-loading'}
                aria-label="downdoot post"
                icon="chevron-down"
            />
        </Flex>
    )
}