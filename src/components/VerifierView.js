import {auth, db, testing} from "../firebase";
import React, {useEffect, useState} from "react";
import {Button} from "react-bootstrap";
import BootstrapTable from 'react-bootstrap-table-next';

// Used to verify the auto-verified tests within the testing instructions
// These tests are testing how things are sent to the database, so the database specifically must be looked at.
export default function MyPantryView() {
    const [results, setResults] = useState([{},{},{},{}]);

    useEffect(()=>{
        runTests();
    }, []);

    function runTests() {
        runTest(22, "Tags/Notes should appear in created space", tagsNotesTest);
        runTest(23, "User feedback is sent to firebase", feedbackTest);
        runTest(24, "Upvoting properly functions", upvoteTest);
        runTest(25, "Downvoting properly functions", downvoteTest);
        // runTest(22, tagsNotesTest);
        // runTest(23, feedbackTest);
        // runTest(24, upvoteTest);
        // runTest(25, downvoteTest);
    }

    function runTest(num, name, testFunction) {
        testFunction().then(result => {
            let resultsCopy = results;
            resultsCopy[num-22] = {
                status: result.status,
                message: result.message
            };
            console.log(`Test #${num} ${name}:\nStatus: ${result.status}\nMessage: ${result.message}\n\n`);
            setResults(resultsCopy);
        });
    }

    function testRows() {
        let rows = []
        rows.push(testRow(22, "Tags/Notes should appear in created space"));
        rows.push(testRow(23, "User feedback is sent to firebase"));
        rows.push(testRow(24, "Upvoting properly functions"));
        rows.push(testRow(25, "Downvoting properly functions"));
        return testRow(22, "Tags/Notes should appear in created space");
    }

    function testRow(num, name) {
        let colorClass;
        if (results[num-22].status === "Success") {
            colorClass = "text-success";
        } else {
            colorClass = "text-danger";
        }
        return <tr>
            <th scope="row">{num}</th>
            <td>{name}</td>
            <td><p className={colorClass}>{results[num-22].status}</p></td>
            <td><p className={colorClass}>{results[num-22].message}</p></td>
        </tr>
    }

    async function tagsNotesTest() {
        let snapshot = await db.collection("Users").doc("xcM2tqVrFxOjJ5hLWWl2yyu9Ka1y").get();
        let recipeId = snapshot.data().createdRecipes[0];
        let recipe = await db.collection("Recipes").doc(recipeId).get();

        try {
            let tags = false;
            let notes = false;
            if (recipe.data().blurb === "Notes") {
                notes = true;
            }
            let r_tags = recipe.data().tags;
            let c_tags = ["1", "2", "3", "4", "5"];
            if (c_tags.length === r_tags.length) {
                tags = true;
                for (let i = 0; i < 5; i++) {
                    if (c_tags[i] !== r_tags[i])
                        tags = false;
                }
            }

            if (tags && notes) {
                return {
                    status: "Success",
                    message: "Found recipe with correct data"
                }
            } else if (tags && !notes) {
                return {
                    status: "Failure",
                    message: `Expected ${recipe.data().blurb} to be "Notes"`
                }
            } else if (!tags && notes) {
                return {
                    status: "Failure",
                    message: `Expected ${r_tags.toString()} to be ${c_tags.toString()}`
                }
            } else {
                return {
                    status: "Failure",
                    message: `Expected ${recipe.data().blurb} to be "Notes" and Expected ${r_tags.toString()} to be ${c_tags.toString()}`
                }
            }
        } catch (e) {
            return {
                status: "Failure",
                message: "Couldn't find recipe object or recipe object malformed"
            }
        }
    }

    async function feedbackTest() {
        let snapshot = await db.collection("Feedback").get();
        try {
            if (snapshot.docs[0].data().feedback === "Feedback") {
                return {
                    status: "Success",
                    message: "Found feedback object successfully"
                }
            } else {
                return {
                    status: "Failure",
                    message: `Expected ${snapshot.docs[0].data().feedback} to be "Feedback"`
                }
            }
        } catch (e) {
            return {
                status: "Failure",
                message: "Couldn't find feedback object"
            }
        }
    }

    async function upvoteTest() {
        let snapshot = await db.collection("Recipes").doc("tKJldEqJZysGtxZ7UnWL").get();
        try {
            if (snapshot.data().upvotedList[0] === "xcM2tqVrFxOjJ5hLWWl2yyu9Ka1y") {
                return {
                    status: "Success",
                    message: "Located upvote on recipe Five successfully"
                }
            } else {
                return {
                    status: "Failure",
                    message: "Upvote not present on recipe Five"
                }
            }
        } catch (e) {
            return {
                status: "Failure",
                message: "Couldn't find recipe Five or malformed"
            }
        }
    }

    async function downvoteTest() {
        let snapshot = await db.collection("Recipes").doc("ljoZ0X5eyX420VkxSya6").get();
        try {
            if (snapshot.data().downvotedList[0] === "xcM2tqVrFxOjJ5hLWWl2yyu9Ka1y") {
                return {
                    status: "Success",
                    message: "Located downvote on recipe One successfully"
                }
            } else {
                return {
                    status: "Failure",
                    message: "Downvote not present on recipe One"
                }
            }
        } catch (e) {
            return {
                status: "Failure",
                message: "Couldn't find recipe One or malformed"
            }
        }
    }

    if (!testing) {
        return <div className='contentInsets'>
            <p>
                Turn on emulator mode to see these tests!
            </p>
        </div>
    } else {
        // Run tests
        return <div className='contentInsets'>
            {/*<Button onClick={(e) => runTests(e)}>Run Tests</Button>*/}
            {/*<table className='table'>*/}
            {/*    <thead>*/}
            {/*        <tr>*/}
            {/*            <th scope="col">#</th>*/}
            {/*            <th scope="col">Name</th>*/}
            {/*            <th scope="col">Result</th>*/}
            {/*            <th scope="col">Message</th>*/}
            {/*        </tr>*/}
            {/*    </thead>*/}
            {/*    <tbody>*/}
            {/*    <tr>*/}
            {/*        <th scope="row">22</th>*/}
            {/*        <td>"test"</td>*/}
            {/*        <td><p>{results[0].status}</p></td>*/}
            {/*        <td><p>{results[0].message}</p></td>*/}
            {/*    </tr>*/}
            {/*    /!*{testRows()}*!/*/}
            {/*    </tbody>*/}
            {/*</table>*/}
            <p>
                Test verifying is being run in the console!
            </p>
        </div>
    }
}