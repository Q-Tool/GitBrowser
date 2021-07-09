# Q-Tool GitBrowser
This project was created with an aim of browsing git Repositories easier. The idea is, you should be able to clone a Git
repository, preview the files, traverse through the history and see how the project was created. This tool is to be used
as a tool to help people learn how the code we use every day came to be.

This tool will be useful for beginner and experienced developers alike, allowing you to step through repositories with
a single click of a button, without having to navigate the history on your repository management software.

## Word of caution, disclaimer
This is still very much in active development, there are no warranties with this software. It is not recommended to use
this software on live repositories (Code you are currently working on). Features WILL change as code is getting finalized.

All being said, if you do use this software, please setup a workspace that is not in the same directory as your active
projects. This project requires a git repository to be initialized before you can use it, meaning you cannot import
projects that do not have a git repository and expect this software to work.

This tool is only meant to be a read only tool. It is not meant to replace your IDE, although some code editing features
may be added in the future.

## Roadmap - No particular order

If you'd like to jump in on the action, these are the items currently on the roadmap. Your help will be greatly appreciated.

 - [ ] Clone Git repositories
   - [x] ~~IPC created to clone repository~~
   - [ ] UI to add a new repository
 - [x] ~~Pull Git Updates~~
 - [ ] Delete Repository
 - [x] ~~Change branches within a repository~~
 - [x] ~~Browse files within a repository~~
 - [ ] Create workspaces
    - [x] ~~IPC to create initial workspace~~
    - [ ] UI to tell the user they need to create a workspace
    - [ ] Multiple workspaces
 - [ ] Open Files within repository
    - [x] ~~Single files~~
    - [x] ~~Syntax Highlighting~~
    - [ ] Multiple files
 - [x] ~~Change commits~~
   - [x] ~~Show history~~
   - [x] ~~Checkout previous commit~~
   - [x] ~~Back and forward buttons to make traversing commits easier~~
 - [ ] Diff preview
 - [ ] Navigate Repository tags
 - [ ] Production Release

This project is currently seeking graphics designers to design icons for each of the different supported programming
languages. The project is currently using an icon set that gets the majority of the popular icons, not all of them.
I would like to add some color to the UI, but I'm definitely not a graphics person.