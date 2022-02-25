var dateVal = "2022-03-08"
var acceptBtn = ".con-wizard button"
var signInBtnInHeader = "#ybar-inner-wrap > div._yb_188ph._yb_1edi5 > div > div._yb_et4o9.ybar-menu-hover-open > div._yb_1c5vv > div > a"
var loginLandingEle = "#login-body"
var usernameInput = "#login-username"
var signInBtn = "#login-signin"
var passwordInput = "#login-passwd"
var financeLink = "#root_5"
var marketDataLink = "#Nav-0-DesktopNav > div > div.nr-applet-main-nav-left.H\(navHeight\).Mend\(80px\).Mend\(0px\)\!.H\(itemHeight_uhMagDesign\)\! > div > nav > ul > li:nth-child(2) > div"
var calendarEle = "#mrt-node-Lead-5-CalEvents ul li"
var header = ".YDC-Header"
var accountMenuBtn = "#header-profile-button"
var accountMenuBody = "#header-profile-panel"
var logoutConfirmBtn = "#login-body > div.login-box-container > div.login-box.right > div.generic-page.confirm-logout > form > input.pure-button.puree-button-secondary.page-button"



function getFirstAndLastDayOfWeek (date) {
    var curr = new Date(date); // get current date
    var currentDay = curr.getDay();
    var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
    var last = first + 6; // last day is the first day + 6

    var firstday = new Date(curr.setDate(first));
    var lastday = new Date(curr.setDate(last));
    return {
        firstDay: firstday,
        lastDay: lastday,
        currentDay: currentDay
    }
}

function formatDateString(date) {
    var currentDate = new Date(date)
    var yy = currentDate.getFullYear()
    var mm = currentDate.getMonth() + 1
    var dd = currentDate.getDate()
    return `${yy}-${mm < 10 ? '0' + mm.toString() : mm}-${dd < 10 ? '0' + dd.toString() : dd}` 
}



describe('Yahoo calendar Automation', () => {
    
    it('Data Driven: Sign In User', () => {
        cy.task('readXlsx', {file: 'cypress/fixtures/Credentials.xlsx', sheet: "Credentials"}).then((rows) => {
            cy.writeFile("cypress/fixtures/xlsxData.json", {rows})
        })

        var {firstDay, lastDay, currentDay} = getFirstAndLastDayOfWeek(dateVal)
        cy.fixture('xlsxData.json').then((data) => {
            for (let idx = 0; idx < data.rows.length; idx++) {
                var userInfo = data.rows[idx]
                cy.visit(Cypress.config('baseURL'))
                cy.wait(5000)
                // cy.get(acceptBtn).then(($acceptBtns) => {
                //     if ($acceptBtns.length > 0) {
                //         cy.get(acceptBtn).first().click({force: true})
                //     }
                // })
                cy.get(usernameInput).type(userInfo.username)
                cy.get(signInBtn).click({force: true})
                cy.wait(5000)
                cy.get("body", {timeout: 5000}).then(($body) => {
                    if ($body.find(passwordInput).length === 0) {
                        cy.log(`${userInfo.username} is incorrect account`)

                    }else {
                        cy.get(passwordInput).should('be.visible').type(userInfo.password)
                        cy.get(signInBtn).click({force: true})
                        cy.wait(5000)
                        
                        cy.get(financeLink).click({force: true})
                        cy.wait(3000)
                        cy.visit(`https://finance.yahoo.com/calendar/?from=${formatDateString(firstDay)}&to=${formatDateString(lastDay)}`)
                        cy.wait(5000)
                        cy.get(header)
                            .invoke('attr', 'style', 'visibility: hidden')
                            .should('have.attr', 'style', 'visibility: hidden')
                        
                        cy.get(calendarEle).eq(currentDay).screenshot(dateVal, {padding: 20})
                        cy.get(calendarEle).eq(currentDay).then(item => {
                            cy.get(calendarEle).eq(currentDay).find('div > span').then($els => {
                                cy.log($els.text())
                            })
                            cy.get(calendarEle).eq(currentDay).then(($aEle) => {
                                if ($aEle.find('a').length > 0) {
                                    Cypress.$.makeArray($aEle.find('a')).map((el) => {cy.log(el.innerText)})
                                    // cy.get(calendarEle).eq(currentDay).find('a').then($aItem => {
                                    //     cy.log($aItem.get('span').text())
                                    // })
                                }
                            })
                        })
                        cy.wait(3000)
                        cy.get(header)
                            .invoke('attr', 'style', 'visibility: visible')
                            .should('have.attr', 'style', 'visibility: visible')
                        
                        cy.get(accountMenuBtn).click({force: true})
                        cy.wait(5000)
                        cy.get(`${accountMenuBody} a`).last().click({force: true})
                        cy.get(logoutConfirmBtn).click({force: true})
                        cy.wait(5000)
                        cy.clearCookies()
                        // cy.get(logoutConfirmBtn).click({force: true})
                    }
                })
                
                
                

                
            
            }
        })
    })
})