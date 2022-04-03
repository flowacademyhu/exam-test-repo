/* globals gauge*/
"use strict";
const path = require('path');
const {
    openBrowser,
    write,
    closeBrowser,
    goto,
    press,
    screenshot,
    above,
    click,
    checkBox,
    listItem,
    toLeftOf,
    link,
    text,
    currentURL,
    $,
    focus,
    into,
    textBox,
    evaluate,
    hover,
    waitFor
} = require('taiko');
const assert = require("assert");
const exp = require('constants');
const { WriteStream } = require('fs');
const expect = require("chai").expect;
const headless = process.env.headless_chrome.toLowerCase() === 'true';

/*beforeSuite(async () => {
    await openBrowser({
        headless: headless
    })
});*/

afterSuite(async () => {
    await closeBrowser();
});

afterScenario(async () => {
    await closeBrowser();
});

step("Open <page> with headless mode <isheadless>", async function (page, isheadless) {
    let headlessParam = isheadless.toLowerCase() === 'true';
    await openBrowser({headless: headlessParam});
    await goto(page);
    let currentUrl = await currentURL();
    expect(currentUrl).to.contain(page);
});

// Return a screenshot file name
gauge.customScreenshotWriter = async function () {
    const screenshotFilePath = path.join(process.env['gauge_screenshots_dir'],
        `screenshot-${process.hrtime.bigint()}.png`);

    await screenshot({
        path: screenshotFilePath
    });
    return path.basename(screenshotFilePath);
};

step("Add task <item>", async (item) => {
    await write(item, into(textBox("What needs to be done?")));
    await press('Enter');
});

step("View <type> tasks", async function (type) {
    await click(link(type));
});

step("Complete tasks <table>", async function (table) {
    for (var row of table.rows) {
        await click(checkBox(toLeftOf(row.cells[0])));
    }
});

step("Clear all tasks", async function () {
    await evaluate(() => localStorage.clear());
});

step("Open todo application", async function () {
    await goto("todo.taiko.dev");
});

step("Must not have <table>", async function (table) {
    for (var row of table.rows) {
        assert.ok(!await text(row.cells[0]).exists(0, 0));
    }
});

step("Must display <message>", async function (message) {
    assert.ok(await text(message).exists(0, 0));
});

step("Add tasks <table>", async function (table) {
    for (var row of table.rows) {
        await write(row.cells[0]);
        await press('Enter');
    }
});

step("Must have <table>", async function (table) {
    for (var row of table.rows) {
        assert.ok(await text(row.cells[0]).exists());
    }
});

step("Click the 'Belépés' button", async function() {
	await click($(`div#mymenu`));
});

step("Write the  <arg0> name, and <arg1>", async function(arg0, arg1) {
	await write(arg0, $(`input#clilog`));
    await write(arg1, $(`input#clikey`));
});

step("Click the 'Belépek' button", async function() {
	//await click($(`button#vop-login-button`), {waitForEvents: ['DOMContentLoaded']});
    await click($(`button#vop-login-button`));
});


step("Cheked the category elemnts on the page", async function() {
	expect(await $(`li.nav-item.dropdown.d-none.d-block`).elements()).to.have.lengthOf(10);
});


step("Search the <arg2> word", async function(arg2) {
	await write(arg2, $(`input#searchQuery`));
    //await press('Enter', {waitForEvents: ['DOMContentLoaded']});
    await click($(`i.fas.fa-search`), {waitForEvents: ['DOMContentLoaded']});
    expect(await $(`div.listing-page-title`).text()).to.contains('Bicikli');
    expect(await currentURL()).to.contains('bicikli');
});

step("The mosue hover the <arg3> menu", async function(arg3) {
	await hover(arg3);
    expect(await $(`div.container:nth-child(4)`).text()).to.contains("Egészség, szépségápolás");
});


step("Click the resault page first item", async function() {
    await waitFor($(`div#list-items-container`));
    await click($(`(//div[@class="col-4 col-md-3 pic"])[1]`));
    expect(await $(`h1.product-title`).text()).to.contains('bicikli');
    expect(await currentURL()).to.contains('bicikli');
});

step("Chek the alert message", async function() {
	expect(await $(`div.form-group:nth-child(1) > div`).text()).to.contains("A megadott felhasználónév, vagy email cím nem található rendszerünkben. Próbáld meg újra, vagy regisztrálj egy új fiókot.");
});