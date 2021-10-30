import React, { useState, useEffect } from "react";
import { Link, Box, Badge, Flex, Text } from "@chakra-ui/react";

import axios from "axios";

export function getAllArticles(query, setState) {
  axios.get("/news/" + query).then((response) => {
    setState(response.data.articles);
  });
}

export function clickHandlerAdd(props, input) {
  // If input isn't in state array
  if (!props.state.includes(input) && props.state.length < 6) {
    props.setState((oldState) => [...oldState, input]);
  } else {
    props.setState((oldState) => [...oldState]);
  }
}

export function clickHandlerRemove(props, input) {
  // If input isn't in state array 
  if (props.state.includes(input)) {
    props.setState((oldState) =>
      oldState.filter(function (query) {
        return query !== input;
      })
    );
  } else {
    props.setState((oldState) => [...oldState]);
  }
}

export function articlePipeline(article, props) {
  // Check if article has image
  if (article.image !== "None") {
    return articleDisplay(article, props);
  } else {
    return false;
  }
}

function articleDisplay(article, props) {
  return (
    <Box borderWidth="1px" boxShadow="sm" m="2" href={article.url}>
      <Flex>
        <Box
          borderWidth="1px"
          borderRadius="lg"
          me="3"
          style={{ width: "250px", height: "152px" }}
        >
          <img
            src={article.image}
            alt={article.title}
            style={{
              minWidth: "250px",
              minHeight: "150px",
              maxHeight: "150px",
            }}
          />
        </Box>
        <Box>
          <Box my="1" ms="1" fontWeight="semibold" as="h4">
            <Link href={article.url} isExternal>
              {article.title}
            </Link>
          </Box>
          <Box ms="1" me="2" minH="50px">
            <Text fontSize="xs" mb="1" as="h6" style={{color:"gray", fontSize: 'var(--chakra-fontSizes-sm)'}}>{article.source.name} | Published {article.publishedAt.slice(0, 10)}</Text>
            <Text fontSize="xs">{article.description}</Text>
          </Box>
          <Box mt="4" ms="1" as="p" minH="42px">
            <Text fontSize="xs" fontWeight="bold">
              Related Topics:{" "}
            </Text>
            {article.tags.map((tag) => (
              <Badge
                borderRadius="full"
                px="2"
                me="1"
                colorScheme="gray"
                _hover={{ bg: "var(--chakra-colors-gray-200)" }}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  clickHandlerAdd(props, tag);
                }}
              >
                {tag}
              </Badge>
            ))}
            <Badge
              borderRadius="full"
              px="2"
              me="1"
              colorScheme={article.sentiment.color}
            >
              {article.sentiment.word}
            </Badge>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}
