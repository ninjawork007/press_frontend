## Waverly Frontend

This application has been created in Next.JS. To get the build running locally the following steps need to be followed.

- clone the repo to you development machine
- open a Terminal session and navigate to the **root** folder
- run **yarn install**
- create a .env file in the root directory and copy in the entries provided
- now run [NGROK](https://ngrok.com/) using **ngrok http 1337** in a terminal session - this is needed so the strapi authentication works
- in the NGROK session you will see an entry called Forwarding. You need to copy the https url and add it as the value for NEXT_PUBLIC_API_URL= in the .env file - you will need to do this everytime you start NGROK 
- now run **npm run dev** in the root directory and, assuming all goes well, the application will be available on http://localhost:3000

If you haven't, already you will need to setup and run the Strapi CMS backend.

## End-To-End Testing

To test the end to end the [Playwright](https://playwright.dev/docs/) test package has been implemented.

Tests can be found in the *./tests* folder and can either be created:
- directly in an appropriate folder within *./tests*, or
- created using the Playwright [Codegen](https://playwright.dev/docs/codegen#running-codegen) tool

To run all tests run *npx playwright test* in the terminal OR *npx playwright test {path to specific test}* to run a specific text file. Note: running tests seems create a bottle next so some arbitrarily fail, even though running the individual file work.

**Note:** you will need to run the following, in the order shown:
- ngrok http 1337
- Strapi
    - npm run develop
- NEXTJS
    - npm run build
    - npm run start

## WhiteLabel Sites - setting up locally
A whitelabel site is where someone essentially resells the service through the use of a sub-domain e.g. demo.localhost:3000 or https://demo.staging.pressbackend.com/.
The steps for setting one of these up locally is as follows, and all be done through the Strapi Content Manager (unless you want to test the front end):
- create a new User and set the *confirmed* flag to TRUE, then Save
- create a Profile with the following set, everything else can be blank, then Save
    - name = the company ame you want to use
    - company_type = select any value
    - email = same as User email
    - is_whitelabel = TRUE
    - users (right side menu) = the user that you just created
- If you look at the Sites content type, you will see that an entry has been automatically created with the name from the Profile as the name of the Site
    - If this hasn't happened, the create a Site with the following set, everything else can be blank, then Save
        - name = Profile name, although can be whatever you want
        - description = some holding text, this only populates a meta tag
        - customDomain = a fake domain name e.g. bobbins.io
        - subdomain = this will set the local subdomain e.g. demo.localhost:3000
        - is_live = TRUE
        - owner (right side menu) = select your new User
        - profiles (right side menu) = select your new Profile
- You should now be able to login, with the User credentials that you have just created, to app.localhost:3000 and see the available options to customise the whitelabel site, as well as change some Profile entries

## Working with the Checkout
When working with the checkout functionality, certain content types will need to exist. These are:
- Publication - making sure it is published!
- Site Publication
    - making sure that is_hidden is set to false
    - the *publication* and *site* values are set in the right hand Relations menu
- You should now see the publication in the whitelabel site, you will need to login, and be able to add it to the basket