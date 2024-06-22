import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';

const LandingPage = () => {
    const [userData, setUserData] = useState({});
    const [editMode, setEditMode] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [updaten, setUpdaten] = useState('');
    const [editedEmail, setEditedEmail] = useState('');
    const [lastName, setLastName] = useState('');
    const [submitMessage, setSubmitMessage] = useState('');
    
    const location = useLocation();
    const { username } = location.state;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`http://localhost:3001/users/${username}`);
                const data = await response.json();
                setUserData(data);
                setFirstName(data.firstName || '');
                setLastName(data.lastName || '');
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [username]);

    const handleupdaten = () =>{
        setUpdaten(true);
    }

    const handleEdit = () => {
        setEditMode(true);
    };

    const handleCancelEdit = () => {
        setEditMode(false);
        setEditedEmail(userData.email); 
    };

    const handleChangeEmail = (e) => {
        setEditedEmail(e.target.value);
    };

    const handleChangeFirstName = (e) => {
        setFirstName(e.target.value);
    };

    const handleChangeLastName = (e) => {
        setLastName(e.target.value);
    };

    const handleSubmitNames = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:3001/users/${username}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ firstName, lastName }),
            });

            const result = await response.json();
            if (response.ok) {
                setSubmitMessage('Names updated successfully!');
                setUserData(result); 
                setUpdaten(false);
            } else {
                setSubmitMessage(result.message || 'Failed to update names');
            }
        } catch (error) {
            console.error('Error updating names:', error);
            setSubmitMessage('Error updating names');
        }
    };

    const handleSubmitEdit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:3001/users/${username}/edit`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: editedEmail }),
            });

            const result = await response.json();
            if (response.ok) {
                setSubmitMessage('User information updated successfully!');
                setUserData(result); 
                setEditMode(false); 
            } else {
                setSubmitMessage(result.message || 'Failed to update user information');
            }
        } catch (error) {
            console.error('Error updating user information:', error);
            setSubmitMessage('Error updating user information');
        }
    };

    return (
        <div className="container">
            
            <Navbar color="blue" light expand="md">
                <NavbarBrand href="/">My App</NavbarBrand>
                <Nav className="mr-auto" navbar>
                    <NavItem>
                        <NavLink href="/register">Register new user</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink href="/login">Log in</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink href="/evs">Events</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink href="/evslist">Create new Event</NavLink>
                    </NavItem>
                </Nav>
            </Navbar>

            <h1>User Information</h1>
            {userData.image && (
                <div>
                    <strong>Profile Picture:</strong>
                    <img src={`http://localhost:3001/images/${userData.image}`} alt="Profile" className="profile-image" />
                </div>
            )}
            <div>
                <strong>Username:</strong> <input type='text' value={userData.username}></input>
            </div>
            <div>
                <strong>Email:</strong> {userData.email}
            </div>

            {!editMode && (
                <button type="button" className="btn btn-secondary" onClick={handleupdaten}>Want to edit email?</button>
            )}

            {editMode && (
                <form onSubmit={handleSubmitEdit}>
                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            className="form-control"
                            value={editedEmail}
                            onChange={handleChangeEmail}
                        />
                    </div>
                    <div className="btn-group">
                        <button type="submit" className="btn btn-primary">Save Changes</button>
                        <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>Cancel</button>
                    </div>
                </form>
            )}

            

            

            <div>
                <strong>First Name:</strong> {userData.firstName}
            </div>
            <div>
                <strong>Last Name:</strong> {userData.lastName}
            </div>

            
           { updaten&& <form onSubmit={handleSubmitNames}>
                <div className="form-group">
                    <label>First Name:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={firstName}
                        onChange={handleChangeFirstName}
                    />
                </div>
                <div className="form-group">
                    <label>Last Name:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={lastName}
                        onChange={handleChangeLastName}
                    />
                </div>
                <button type="submit" className="btn btn-primary">Update Names</button>
            </form>}

            <button type="button" className="btn btn-secondary" onClick={handleupdaten}>Want to add names or update names</button>

            {submitMessage && <div className="alert">{submitMessage}</div>}
        </div>
    );
};

export default LandingPage;

