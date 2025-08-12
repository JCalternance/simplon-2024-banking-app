import { FaTrash } from 'react-icons/fa';
import './DeleteButton.css';

const DeleteButton = ({ onClick }) => {
    return (
        <button className="delete-button" onClick={onClick}>
            <FaTrash />
        </button>
    );
};

export default DeleteButton;