
class UserFormHelper {

    constructor(navigateHome) {

        this.minPasswordLength = 6;
        this.emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    }

    RenderInformationText = (text, isError) => {
        return (
            <span className='d-flex align-items-center my-1'>
                <div className={`colorCircle ${isError ? 'red' : 'green'} me-1`}></div>
                <span className=''>{text}</span>
            </span>
        );
    }
}

export default UserFormHelper;