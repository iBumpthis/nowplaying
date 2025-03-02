# Now iBumping Record Web App
Capable of running locally with the index.html file with the addition of pulling data from a Google Sheet

# Alpha Build Screenshot
https://github.com/iBumpthis/nowplaying/blob/main/app_2025_02_24_screenshot.png

# Current Requirements
- Creation of a Google Sheet with the formatting found below
- Setting Google Sheet to "Anyone with link" share visibility
- Creation of a Google API Key (https://support.google.com/googleapi/answer/6158862?hl=en)
- Swapping in the Sheet ID and Sheets API key to the main.js file if running locally

# Example Google Doc Formatting
https://docs.google.com/spreadsheets/d/1ljUYJxvntdMKfg8d3aMIZsoN5D7eGAIF-AmcUvfijGk/edit?usp=sharing
If you format your Google Document like this (column headers, info, etc.) the application should function

Column headers are as follows
- Artist
- Title
- Genre
- Sub-Genre
- DiscogsID
- Location
- Recent (Checkbox)

# DiscogsID Column Notes
- The DiscogsID column generates URLs to Discogs entries (off creating a variable from the DiscogsID value and adding a URL to the Title column entry
- The ID is not visible within the table as a column, it is only used for other backend functions
- The current image URL is also based on the data stored in the DiscogsID column, any text can function here and call to an image (but this would break the Discogs URL link)

# Images Path(s)
- Images are called based on the DiscogsID column noted above in JPG format currently under the format ${rowData[4]}.jpg
- Thumbnail images are stored in "./records/thumbs/${rowData[4]}.jpg" when the information modal is loaded
- Full images are stored in "./records/full/${rowData[4]}.jpg" when the album art modal is loaded (clicking on [SPIN IT] or the thumbnail)
- There is a placeholder.jpg in both Thumbs and Full that will operate as a fallback in the case the DiscogsID file named .jpg is not present

# Google Sheet Info
- Artist (Artist Name)
- Title (Album Title)
- Genre (Drop-down Sort | Album Genre)
- Sub-Genre (Drop-down Sort | Further clarification for the album/artist genre to sort more specifically)
- DiscogsID (Hidden from display, used to create Discogs URL link variables, displayed on the pop-out modal)
- Location (Drop-down Sort | Used if you store records in multiple places, I have my main rack with the player and then a few crates/boxes I have labeled as "Archive")
- Recent (Checkbox | Used to track whether the record has been recently played for the ability to only sort from unplayed albums, currently managed in the sheet but in a future state I will try to add write-back capabilities to be managed from the app itself)

# Current Capabilities
- Loads data from the above formatted Google Sheet
- Live type search filtering
- Drop-down filtering for multiple columns
- Choose a Random Record button (updates to choose randomly from filter/search selection)
- Pop out modal for chosen record on Row click or Choose Random

# Future Plans
- Setting up OAuth for write back/edit capabilities to the sheet
- Commented sections to allow for running directly from a CSV or DB
- Image directory that will likely use the format {discogsID}.png to pull album or artist images, currently only a 150x150 placeholder exists
- Support for multiple image type formats (jpg/jpeg/png/gif/bmp/svg/etc)
- Updating of CSS and styling
- (Long Term) Database Read/Write for updating on the fly, removal of Google Sheets Requirement - will likely be a new fork
- (Long Term) Pulling and storing of Images from external source for larger collections to reduce manual work
- (Long Term) Allowing connection to the Discogs API for pulling of collection info - will likely be a new fork - also not sold on doing this as I want this to be able to work standalone without heavy web calls for display on a Pi/Simple tablet/small screen near a record player
- (So Long Term It Is Not Worth Really Discussing) Connection to a listening API that will kick off in passive listening mode for when a needle is dropped and a record starts playing - services that do this off analog records (without digital payload input) and have a callable API do not really appear to exist, though
