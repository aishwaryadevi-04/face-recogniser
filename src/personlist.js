import { React, useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { useParams } from 'react-router-dom';
function PersonList({people}) {

    console.log(people)
    return (
        <div className="container mt-5">
            <div className="col-md-6 offset-md-2 ">
                <div className="card">
                    <div className="card-body">
                        
                        <div className="personlist-container">
                                <div>
                                    <h1>{people.name}</h1>
                                    <p>Age: {people.age}</p>
                                    <p>Department: {people.department}</p>
                                </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PersonList;
