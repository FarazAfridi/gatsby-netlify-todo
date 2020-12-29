import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import gql from "graphql-tag";
import { Heading, Input, Button, Container, Flex } from "theme-ui";

const GET_TODOS = gql`
  {
    todos {
      task
      id
      status
    }
  }
`;
const ADD_TODO = gql`
  mutation addTodo($task: String!) {
    addTodo(task: $task) {
      task
    }
  }
`;

const DELETE_TODO = gql`
  mutation deleteTodo($id: ID!) {
    deleteTodo(id: $id) {
      id
    }
  }
`;

const UPDATE_TODO = gql`
  mutation updateTodo($id: ID!, $task: String!) {
    updateTodo(id: $id, task: $task) {
      id
    }
  }
`;

export default function Home() {
  let taskInput;
  const [deleteTodo] = useMutation(DELETE_TODO);
  const [updateTodo] = useMutation(UPDATE_TODO);
  const [addTodo] = useMutation(ADD_TODO);

  const [inputText, setInputText] = useState('');

  const addTask = () => {
    addTodo({
      variables: {
        task: inputText.value,
      },
      refetchQueries: [{ query: GET_TODOS }],
    });
    setInputText('');
  };

  const deleteTask = (id) => {
    deleteTodo({
      variables: {
        id,
      },
      refetchQueries: [{ query: GET_TODOS }],
    });
  };

  const updateTask = (id) => {
    taskInput = prompt("Update Task");
    updateTodo({
      variables: {
        id: id,
        task: taskInput,
      },
      refetchQueries: [{ query: GET_TODOS }],
    });
  };


  const { loading, error, data } = useQuery(GET_TODOS);

  if (loading) return <h2>Loading..</h2>;

  if (error) {
    console.log(error);
    return <h2>Error</h2>;
  }

  return (
    <Container p={3} className="container">
      <Flex
        sx={{
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Heading p={2} as="h1">
          Add Task
        </Heading>
        <Input
          sx={{ width: "30%", minWidth: "250px" }}
          m={2}
          type="text"
          ref={(node) => {
            setInputText(node);
          }}
        />

        <Button m={2} variant="primary" onClick={addTask}>
          Add Task
        </Button>
      </Flex>
      <Flex sx={{ flexDirection: "column" }}>
        <Heading sx={{ margin: "20px auto" }} as="h1" p={2}>
          MY TODO LIST
        </Heading>
        <Flex
          sx={{
            margin: "10px 0",
            flexDirection: "column",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {data.todos.map((todo) => {
            return (
              <Flex key={todo.id}
                style={{
                  flexWrap: "wrap",
                  fontSize: "20px",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    padding: "20px",
                    width: "50%",
                    minWidth: "200px",
                    textAlign: "center",
                  }}
                >
                  <span style={{ margin: "10px" }}>{todo.task}</span>
                  <span>{todo.status.toString()}</span>
                </div>
                <div>
                  <Button
                    sx={{ margin: "5px" }}
                    onClick={() => deleteTask(todo.id)}
                  >
                    Delete
                  </Button>
                  <Button onClick={() => updateTask(todo.id)}>Update</Button>
                </div>
              </Flex>
            );
          })}
        </Flex>
      </Flex>
    </Container>
  );
}
