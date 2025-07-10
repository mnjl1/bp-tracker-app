import json

def test_register(test_client):
    """
    GIVEN a Flask application
    WHEN the '/register' page is posted to (POST)
    THEN check that a '201' (Created) status code is returned
    """
    response = test_client.post('/register',
                                data=json.dumps(dict(
                                    email='testuser@example.com',
                                    password='password123'
                                )),
                                content_type='application/json')
    assert response.status_code == 201
    assert b"New user created!" in response.data

def test_login(test_client):
    """
    GIVEN a Flask application with a registered user
    WHEN the '/login' page is posted to (POST)
    THEN check that a '200' (Success) status code is returned and a token is in the response
    """
    # First, register a user to be able to log in
    test_client.post('/register',
                     data=json.dumps(dict(email='testlogin@example.com', password='password123')),
                     content_type='application/json')

    # Now, try to log in
    response = test_client.post('/login',
                                data=json.dumps(dict(
                                    email='testlogin@example.com',
                                    password='password123'
                                )),
                                content_type='application/json')

    data = json.loads(response.data)
    assert response.status_code == 200
    assert 'token' in data

def test_get_readings_unauthorized(test_client):
    """
    GIVEN a Flask application
    WHEN the '/readings' page is requested (GET) without a token
    THEN check that a '401' (Unauthorized) status code is returned
    """
    response = test_client.get('/readings')
    assert response.status_code == 401
    assert b"Token is missing!" in response.data

def test_add_and_get_readings_authorized(test_client):
    """
    GIVEN a Flask application with a logged-in user
    WHEN a new reading is added and then all readings are requested
    THEN check that the new reading is returned
    """
    # Register and Login to get a token
    test_client.post('/register', data=json.dumps(dict(email='authtest@example.com', password='password')), content_type='application/json')
    login_response = test_client.post('/login', data=json.dumps(dict(email='authtest@example.com', password='password')), content_type='application/json')
    token = json.loads(login_response.data)['token']

    # Add a reading with the token
    add_response = test_client.post('/readings',
                                     headers={'x-access-token': token},
                                     data=json.dumps(dict(
                                         systolic=120,
                                         diastolic=80,
                                         date='2025-07-10'
                                     )),
                                     content_type='application/json')
    assert add_response.status_code == 201

    # Get readings with the token
    get_response = test_client.get('/readings', headers={'x-access-token': token})
    data = json.loads(get_response.data)

    assert get_response.status_code == 200
    assert len(data) == 1
    assert data[0]['systolic'] == 120
    assert data[0]['diastolic'] == 80
