const { ApolloServer, gql } = require("apollo-server-lambda");
var faunadb = require("faunadb"),
  q = faunadb.query;

const typeDefs = gql`
  type Query {
    todos: [Todo!]
  }
  type Mutation {
    addTodo(task: String!): Todo
    deleteTodo(id: ID!): Todo
    updateTodo(id: ID!, task: String!): Todo
  }
    
  type Todo {
    id: ID!
    task: String!
    status: Boolean!
  }
`;

const resolvers = {
  Query: {
    todos: async (root, args, context) => {
      try {
        var adminClient = new faunadb.Client({
          secret: process.env.FAUNA_DB_SECRET,
        });
        const result = await adminClient.query(
          q.Map(
            q.Paginate(q.Match(q.Index("task"))),
            q.Lambda((x) => q.Get(x))
          )
        );

        return result.data.map((d) => {
          return {
            id: d.ref.id,
            status: d.data.status,
            task: d.data.task,
          };
        });
      } catch (err) {
        console.log(err);
      }
    },
  },
  Mutation: {
    addTodo: async (_, { task }) => {
      try {
        var adminClient = new faunadb.Client({
          secret: process.env.FAUNA_DB_SECRET,
        });
        const result = await adminClient.query(
          q.Create(q.Collection("todos"), {
            data: {
              task: task,
              status: true,
            },
          })
        );
        return result.ref.data;
      } catch (err) {
        console.log(err);
      }
    },
    deleteTodo: async (_, {id}) => {
      try {
        var adminClient = new faunadb.Client({
          secret: process.env.FAUNA_DB_SECRET,
        });
        const result = await adminClient.query(
         
          q.Delete(q.Ref(q.Collection("todos"), id))
        );
          console.log(result)
      } catch (error){
        console.log(error);
      }
    },
    updateTodo: async (_, {id, task}) => {
      try {
        console.log(id, task);
        var adminClient = new faunadb.Client({
          secret: process.env.FAUNA_DB_SECRET,
        });
        const result = await adminClient.query(
         
          q.Update(
            q.Ref(q.Collection("todos"), id),
            {
              data: {
                task
              }
            }
          )
        )
        console.log(result);
      } catch (error){
        console.log(error);
      }
    }
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

exports.handler = server.createHandler();
