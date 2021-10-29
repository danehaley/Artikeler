import React, { useState, useEffect } from "react";
import { Box, Badge, Skeleton, Divider, Stack, Text } from "@chakra-ui/react";
import { getAllArticles, clickHandlerAdd } from "../misc/article-helpers.js";

export default function Trending(props) {
  const [articles, setArticles] = useState(false);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    getAllArticles("headlines", setArticles);
  }, []);

  useEffect(() => {
    if (articles) {
      setLoading(false);
    }
  }, [articles]);

  if (isLoading) {
    return (
      <div className="App">
        <Box overflow="hidden" m="2">
          <Text fontSize="sm" as="h4" fontWeight="semibold">
            Trending Topics:{" "}
          </Text>
          <Stack>
            <Skeleton height="15px" />
            <Skeleton height="15px" />
            <Skeleton height="15px" />
            <Skeleton height="15px" />
          </Stack>
        </Box>
        <Divider
          m="2"
          style={{
            width: "1094px",
          }}
        />
      </div>
    );
  }

  return (
    <div>
      <Box overflow="hidden" m="2" p="2">
        <Text fontSize="sm" as="h4" fontWeight="semibold">
          Trending Topics:{" "}
        </Text>
        <ul>
          <Box mt="1" as="p" lineHeight="tight">
            {articles.map((article) =>
              article.tags.map((tag) => (
                <Badge
                  borderRadius="full"
                  px="2"
                  ms="1"
                  colorScheme="gray"
                  onClick={() => {
                    clickHandlerAdd(props, tag);
                  }}
                  _hover={{ bg: "var(--chakra-colors-gray-200)" }}
                  style={{ cursor: "pointer" }}
                >
                  {tag}
                </Badge>
              ))
            )}
          </Box>
        </ul>
      </Box>
      <Divider
        m="2"
        style={{
          width: "1094px",
        }}
      />
    </div>
  );
}
