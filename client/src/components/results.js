import React, { useState, useEffect } from "react";
import {
  Badge,
  Flex,
  Text,
  Skeleton,
  IconButton,
  PopoverContent,
  FormControl,
  FormLabel,
  Input,
  Button,
  Popover,
  PopoverTrigger,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import {
  getAllArticles,
  articlePipeline,
  clickHandlerRemove,
  clickHandlerAdd,
} from "../misc/article-helpers.js";

export default function Results(props) {
  const [articles, setArticles] = useState(false);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setArticles(null);
    if (props.state.length !== 0) {
      getAllArticles(
        "search/" + props.state.join(" ").replace(/-/g, " "),
        setArticles
      );
    }
  }, [props.state]);

  useEffect(() => {
    if (articles) {
      setLoading(false);
    } else if (props.state.length === 0) {
      setLoading(false);
    }
  }, [articles]);

  if (isLoading) {
    return (
      <div className="App">
        <Flex m="2">
          <Text
            as="p"
            Text
            fontSize="xs"
            fontWeight="bold"
          >{`Now loading results for (${props.state.length}/6): `}</Text>
          {props.state.map((tag) => {
            return (
              <Badge
                borderRadius="full"
                lineHeight="tight"
                px="2"
                ms="1"
                colorScheme="gray"
                _hover={{ bg: "var(--chakra-colors-gray-200)" }}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  clickHandlerRemove(props, tag);
                }}
              >
                {tag.replace(/\s+/g, "-").toLowerCase()}
              </Badge>
            );
          })}
          <AddButton state={props.state} setState={props.setState} />
        </Flex>
        <Skeleton height="152px" m="2"></Skeleton>
        <Skeleton height="152px" m="2"></Skeleton>
        <Skeleton height="152px" m="2"></Skeleton>
        <Skeleton height="152px" m="2"></Skeleton>
        <Skeleton height="152px" m="2"></Skeleton>
        <Skeleton height="152px" m="2"></Skeleton>
        <Skeleton height="152px" m="2"></Skeleton>
        <Skeleton height="152px" m="2"></Skeleton>
        <Skeleton height="152px" m="2"></Skeleton>
      </div>
    );
  }

  return (
    <div>
      <Flex m="2" lineHeight="tight">
        <Text
          as="p"
          Text
          fontSize="xs"
          fontWeight="bold"
        >{`Now showing results for (${props.state.length}/6): `}</Text>
        {props.state.map((tag) => {
          return (
            <Badge
              borderRadius="full"
              px="2"
              ms="1"
              colorScheme="gray"
              _hover={{ bg: "var(--chakra-colors-gray-200)" }}
              style={{ cursor: "pointer" }}
              onClick={() => {
                clickHandlerRemove(props, tag);
              }}
            >
              {tag.replace(/\s+/g, "-").toLowerCase()}
            </Badge>
          );
        })}
        <AddButton state={props.state} setState={props.setState} />
      </Flex>
      {articles === null ? null : (
        <ul>{articles.map((article) => articlePipeline(article, props))}</ul>
      )}
    </div>
  );
}

function AddButton(props) {
  const [toggle, setToggle] = useState(false);

  const handleSubmit = (input) => {
    clickHandlerAdd(props, input);
  };

  if (props.state.length < 6) {
    return (
      <Popover>
        <PopoverTrigger>
          <IconButton
            aria-label="Add to searchterms"
            size="xs"
            ms="1"
            icon={<AddIcon />}
            onClick={() => {
              setToggle(true);
            }}
          />
        </PopoverTrigger>
        {PopoverCheck(toggle, handleSubmit)}
      </Popover>
    );
  } else {
    return (
      <Popover>
        <IconButton
          aria-label="Add to searchterms"
          size="xs"
          ms="1"
          icon={<AddIcon />}
          onClick={() => {
            setToggle(false);
          }}
          isDisabled="false"
        />
        {PopoverCheck(toggle, handleSubmit)}
      </Popover>
    );
  }

  function PopoverCheck(state, handleSubmit) {
    const [input, setInput] = useState("");
    if (state === true) {
      return (
        <PopoverContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(input);
            }}
          >
            <FormControl isRequired>
              <FormLabel mx="2">Topic</FormLabel>
              <Input
                size="sm"
                mx="2"
                width="95%"
                onChange={(event) => setInput(event.currentTarget.value)}
              />
            </FormControl>
            <Button variantColor="gray" type="submit" width="95%" m={2}>
              Add
            </Button>
          </form>
        </PopoverContent>
      );
    }
  }
}
