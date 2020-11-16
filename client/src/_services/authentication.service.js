import { BehaviorSubject } from 'rxjs';


const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user')));

export const authenticationService = {
    login,
    logout,
    user: currentUserSubject.asObservable(),
    get currentUserValue () { return currentUserSubject.value }
};

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if ([401, 403].indexOf(response.status) !== -1) {
                // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
                authenticationService.logout();
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}

function login(username, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    };
    return new Promise(async function (resolve, reject) {
        try {
            const response = await fetch('/users/authenticate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            const user = await response.json().then(handleResponse);
            if (response.ok) {
                localStorage.setItem('user', JSON.stringify(user));
                currentUserSubject.next(user);
                resolve(user);
            }
            else
                reject();
        }
        catch (e) {
            reject();
        }
    });

}
function logout() {

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    };
    localStorage.removeItem('user');
    currentUserSubject.next(null);
    return fetch('/logout',requestOptions);
}