import { useActionData, Form } from 'react-router-dom';
import { Link } from 'react-router-dom';

function Register() {
    const actionData = useActionData();

    return (
        <div>
            <main>
                <div>
                    <div>
                        <img src="/logo.png" alt="MERC-A Logo" />
                    </div>
                    <div>MERCADORIA DE ARGILA</div>
                </div>

                <div>
                    <h2>Create an account</h2>
                    <p>Enter your details below</p>

                    {actionData?.error && (
                        <div>{actionData.error}</div>
                    )}

                    <Form method="post">
                        <div>
                            <label htmlFor="fullName">Name</label>
                            <input
                                id="fullName"
                                name="fullName"
                                type="text"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="email">Email or Phone Number</label>
                            <input
                                id="email"
                                name="email"
                                type="text"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                            />
                        </div>

                        <button type="submit">Create Account</button>
                    </Form>

                    <div>
                        <span>Already have account?</span>
                        <Link to="/login">Log In</Link>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Register;
