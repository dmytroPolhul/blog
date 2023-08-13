export default {
    introspection: {
        type: 'sdl',
        paths: ['./schema.gql'],
    },
    website: {
        template: 'carbon-multi-page',
        options: {
            appTitle: 'Blog task',
            appLogo: 'https://cloudentity.com/developers/uploads/brand_logos/graphql_logo_white.png',
            pages: [{
                title: 'Main documentation',
                content: `
# Useful links
- Production: [Fly.io](https://blog-graphql.fly.dev/graphql) 
`
            }],
        },
    },
}
