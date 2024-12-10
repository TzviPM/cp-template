# cp-template Visual Studio Code Extension

A convenient way of duplicating existing files and directories, using them as a template for new code.

_Inspired by [File Utils](https://github.com/sleistner/vscode-fileutils)._

## How do I use this?

-   Right click on a file or folder in the Explorer pane or in a file tab.
-   Select `Duplicate (template)`.
-   Answer the questions:
    -   Target path to which the code will be duplicated
    -   Template string: the code in the source tree that will become templated
    -   Replacement string: the new value for instantiating the template in the target

## What the heck is this thing?

Many times, code gets repetitive or a new feature needs to be built which is *almost* identical to some existing code but needs to be modified for a different use case [in which a common abstraction doesn't make sense](https://www.tzvipm.dev/posts/thats-not-dry).

This is why I invented `cp-template` back in 2016. Simply take some existing code, invoke `Duplicate (template)`, specify the source text to template on and the target replacement, and ba-da-boom ba-da-bing! Enjoy!

## Known Issues

None

## Release Notes

### 0.0.1

Initial release of `cp-template`