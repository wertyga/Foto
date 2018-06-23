import './404.sass';

const noFound = () => {
    return (
        <div className="not-found-page"
             style={{
                 width: '100vw',
                 height: '100vh',
                 top: 0,
                 left: 0,
                 position: 'fixed',
                 display: 'flex',
                 alignItems: 'center',
                 flexDirection: 'column'}}>
            <div className="404-content" style={{ marginTop: '20%', textAlign: 'center'}}>
                <h2>Page not found</h2>
                <h2>404 Error</h2>
            </div>

        </div>
    );
};

export default noFound;