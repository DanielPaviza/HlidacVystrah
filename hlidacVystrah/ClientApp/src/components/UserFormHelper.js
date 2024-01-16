
class UserFormHelper {

    constructor(navigateHome) {

        this.minPasswordLength = 6;
        this.emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    }

    EmailValid(email) {
        return this.emailRegex.test(email);
    }

    RenderInformationText = (text, isError) => {
        return (
            <span className='d-flex my-1 formInfo'>
                <div className={`colorCircle ${isError ? 'red' : 'green'} me-1 mt-1`}></div>
                <span className=''>{text}</span>
            </span>
        );
    }
}

export default UserFormHelper;