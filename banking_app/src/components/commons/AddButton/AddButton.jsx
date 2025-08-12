import { FaPlus } from 'react-icons/fa';
import './AddButton.css';

const AddButton = ({onClick}) => {
    return (
        <button className="add-button" onClick={onClick} aria-label="Ajouter un élément">
            <FaPlus className="add-icon" />
        </button>
    )
};

export default AddButton;