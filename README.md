# Now iBumping Record Web App
Capable of running locally with the index.html file with the addition of pulling data from a Google Sheet

# Alpha Build Screenshot
https://github.com/iBumpthis/nowplaying/blob/main/app_2025_02_24_screenshot.png

# Current Requirements
- Creation of a Google Sheet with the formatting found below
- Setting Google Sheet to "Anyone with link" share visibility
- Creation of a Google API Key (https://support.google.com/googleapi/answer/6158862?hl=en)
- Swapping in the Sheet ID and Sheets API key to the main.js file if running locally

# Google Sheet Formatting
Column headers are as follows
- Artist
- Title
- Genre
- Sub-Genre
- DiscogsID
- Location
- Recent

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
- Updating of CSS and styling
- (Long Term) Database Read/Write for updating on the fly, removal of Google Sheets Requirement - will likely be a new fork
- (Long Term) Pulling and storing of Images from external source for larger collections to reduce manual work
