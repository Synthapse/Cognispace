

interface IProgressBar {
    bgcolor?: string;
    completed: number;
}

export const ProgressBar = (props: IProgressBar) => {
    const { bgcolor, completed } = props;

    const containerStyles = {
        height: 4,
        width: '400px',
        backgroundColor: "#e0e0de",
        borderRadius: 50,
    }

    const fillerStyles = {
        height: '100%',
        width: `${completed}%`,
        background: 'linear-gradient(to right, #4B73E9, #6092F3)',
        borderRadius: 'inherit',

    }

    const labelStyles = {
        padding: 5,
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold'
    }

    return (
        <div style={containerStyles}>
            <div style={fillerStyles}>
                <span style={labelStyles}>{`${completed}%`}</span>
            </div>
        </div>
    );
};