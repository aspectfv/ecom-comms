export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-grid">
                    <div className="footer-section">
                        <h3>Merca Finds</h3>
                        <p>by Mercadoria de Argila</p>
                        <p>The ultimate one-stop platform for discovering a curated selection of pre-owned and brand-new items</p>
                        <img src="https://placehold.co/100x50?text=Logo" alt="Merca Finds Logo" width={100} />
                    </div>

                    <div className="footer-section">
                        <h4>Support</h4>
                        <p>123 Market Street</p>
                        <p>San Francisco, CA 94103</p>
                    </div>

                    <div className="footer-section">
                        <h4>Contact</h4>
                        <p>exclusive@gmail.com</p>
                        <p>+1 (555) 123-4567</p>
                    </div>

                    <div className="footer-section">
                        <h4>Follow Us</h4>
                        <div className="social-links">
                            <button>📷</button>
                            <button>🐦</button>
                            <button>👥</button>
                        </div>
                    </div>
                </div>

                <hr />

                <p className="copyright">© 2025 Merca Finds. All rights reserved.</p>
            </div>
        </footer>
    );
}
