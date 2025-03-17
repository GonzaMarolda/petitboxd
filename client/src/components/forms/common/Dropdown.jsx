import React, { useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import './Dropdown.css'
import '../MovieForm.css'

const Dropdown = ({ DataService, isMultiple, onModify, placeholder, classNameSelected, classNameInput, maxSelections }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [data, setData] = useState([])
    const [filteredData, setFilteredData] = useState([])
    const [selectedData, setSelectedData] = useState([])
    const dropdownRef = useRef(null);
    const inputRef = useRef(null)

    useEffect(() => {
        DataService
            .getAll()
            .then(data => {
                setData(data)
                setFilteredData(data);
            })
    }, [])

    // Handle clicks for dropdown closure
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
            }
        };
    
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } 
    
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleEnter = (event) => {
        event.preventDefault(); 
        if (filteredData.length == 0) return

        const firstMatch = filteredData[0]
        isMultiple ? handleSelectionMultiple(firstMatch) : handleSelection(firstMatch) 
    };

    const handleSelection = (item) => {
        setSearchQuery('')
        setIsOpen(false)
        onModify(item)
    }

    const handleSelectionMultiple = (item) => {
        if (selectedData.length >= maxSelections) return;

        setSelectedData(selectedData.concat(item))
        const newFilteredData = filterData('').filter(i => i.id !== item.id)
        setFilteredData(newFilteredData)
        setSearchQuery('')
        
        onModify(item, true)
    }

    const handleRemove = (item) => {
        setSelectedData(selectedData.filter(i => i.id !== item.id))
        const newFilteredData = filterData(searchQuery).concat(item)
        setFilteredData(newFilteredData)

        onModify(item, false)
    }

    const filterData = (searchQueryValue) => {
        return data.filter(i => 
            i.name.toLowerCase().startsWith(searchQueryValue.toLowerCase()) &&
            !selectedData.some(selected => selected.id === i.id)
        )
    }

    return (
        <div className="multiple-dropdown-container">
            <div className="dropdown-container">
                <div 
                    className={classNameInput} 
                    onClick={() => {
                        setIsOpen(true)
                        filterData(searchQuery)
                    }}
                >
                    <input
                        type="text"
                        placeholder={placeholder}
                        value={searchQuery}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleEnter(e)}}
                        onChange={(e) => {
                            setSearchQuery(e.target.value)
                            const newFilteredData = filterData(e.target.value)
                            setFilteredData(newFilteredData)}}
                        ref={inputRef}
                    />
                </div>
                
                {isOpen && (
                    <div 
                        className="dropdown-menu"
                        role="listbox"
                        ref={dropdownRef}
                    >
                        {filteredData
                            .sort((a, b) => {
                                if (a.name < b.name) {
                                    return -1;
                                }
                                if (a.name > b.name) {
                                    return 1;
                                }
                                return 0;})
                            .map(item => (
                                <div
                                    key={item.id}
                                    className="dropdown-item"
                                    onClick={() => {
                                        isMultiple ? handleSelectionMultiple(item) : handleSelection(item) 
                                        setIsOpen(false)
                                        setSearchQuery('')}}
                                    role="option"
                                >
                                    {item.name}
                                </div>))
                        }
                    </div>
                )}
            </div>
            <div className="selected-item-container">
                {isMultiple && (
                    <>
                    {selectedData.map(item => (
                        <div key={item.id} className={classNameSelected}>
                            <span>{item.name}</span>
                            <button 
                                type="button" 
                                className="remove-item"
                                onClick={() => handleRemove(item)}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                    </>
                )}
            </div>
        </div>
    )
}
Dropdown.propTypes = {
    DataService: PropTypes.object.isRequired,
    isMultiple: PropTypes.bool.isRequired,
    onModify: PropTypes.func.isRequired,
    placeholder: PropTypes.string.isRequired,
    classNameSelected: PropTypes.string.isRequired,
    classNameInput: PropTypes.string.isRequired,
    maxSelections: PropTypes.number.isRequired

}

export default Dropdown