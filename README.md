
# SilverBullet plug for Hacker News

This plug adds support to search, query and add comments to your notes. 

## Installation
Run the {[Plugs: Add]} command and paste in: `github:s41nn0n/silverbullet-hackernews`

## Use

Put a `HN` block in your markdown:

    ```HN
    43388908
    ```

or

    ```HN
    id: 43388908
    depth: 1
    children: 1
    ```

This will then fetch the item and add it to your SB!

- id: This is the ID (comment, job etc)
  - required
- depth(1): how far down the rabit hole you want to go? 
  - -1 is all
- children(-1): fetch this many children
  - -1 all

Note: The more items that need to be retrieved the longer it takes.

## Config

You can use a `space-config` block to customize this plug. 


   ```space-config
   hackernews:
     inline: "11.4.0"
     baseOutPath: ""
   ```

- inline
  - true: New page
  - false: pop out : dynamic page
- panelType: Where you want your search to be output
  - lhs
  - rhs
  - modal
- baseOutPath: 
  - html: it will output to a modal (dynamic page)
  - default: this will save to a page 

