Feature: User login on secret santa website and run the box

Scenario: User logs in successfully and creates box
Given user is on secret santa login page
When user logs in as "luchiana.sv+prova1@gmail.com" and "GRDSTL55"
Then user is on dashboard page
And box identifier created
And user creates a new box

Scenario: User invites participants via link
Given user clicks the button
When user copies invite link
Then user logs out

Scenario: Approve participants via link
Given user access secret santa page after clicking invite link
When user clicks the button create participant card
And user logs in using login "<login>" and password "<password>"
Then user creates participants card
And user logs out
Examples:
    | login | password | 
    | luchiana.sv+prova2@gmail.com  | GRDSTL55  |
    | luchiana.sv+prova3@gmail.com  | test3456  |
  
Scenario: User adds participants manually
Given user is on secret santa login page
When user logs in as "luchiana.sv+prova1@gmail.com" and "GRDSTL55"
Then user adds partisipants manually with table
    | name | email | 
    | irina3  | luchiana.sv+prova4@gmail.com   |
    | irina4  | luchiana.sv+prova5@gmail.com  |

Scenario: User participates in the draw
When user chooses to participate in the draw
Then user creates participant card for himself  

Scenario: User conducts the draw and check the result
Given user starts the draw
When user clicks on secret santa table link
Then user can see who is whose Santa

Scenario: User deletes box after all scenarios
Given user has got the box identifier
When user deletes box
Then box does not exist