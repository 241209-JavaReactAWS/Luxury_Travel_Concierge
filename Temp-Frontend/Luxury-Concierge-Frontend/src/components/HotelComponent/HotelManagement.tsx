import React, { useState, useEffect } from "react";
import "./HotelManagement.css";
import Supplementaries from "../../SupplementaryClass";
import axios from "axios";

interface Hotel {
  hotelId: number;
  name: string;
  location: string;
  // city: string;
  // state: string;
  // country: string;
  // postalCode: string;
  // phone: string;
  // email: string;
  description: string;
  imageUrl: string;
}

const HotelManagementPage: React.FC = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [newHotel, setNewHotel] = useState<Partial<Hotel>>({
    name: "",
    location: "",
    description: "",
    imageUrl: "",
  });
  const [currentHotel, setCurrentHotel] = useState<Partial<Hotel>>({
    name: "",
    location: "",
    // city: "",
    // state: "",
    // country: "",
    // postalCode: "",
    // phone: "",
    // email: "",
    description: "",
    imageUrl: "",
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch hotels owned by the logged-in user
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch(Supplementaries.serverLink + "hotels");
        const data = await response.json();
        setHotels(data);
      } catch (error) {
        console.error("Error fetching hotels:", error);
      }
    };

    fetchHotels();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentHotel((prev) => ({ ...prev, [name]: value }));
    setNewHotel({ ...newHotel, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleEditClick = (hotel: Hotel) => {
    setIsEditing(true);
    setCurrentHotel(hotel);
  };

  const handleUpdateHotel = async () => {
    try {
      const formData = new FormData();
      if (selectedImage) formData.append("image", selectedImage);
      Object.entries(currentHotel).forEach(([key, value]) => {
        if (value) formData.append(key, value.toString());
      });

      const response = await fetch(`${Supplementaries.serverLink}hotels/${currentHotel.hotelId}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to update hotel");
      alert("Hotel updated successfully!");
      setIsEditing(false);
      setSelectedImage(null);
      // fetchHotels();
    } catch (error) {
      console.error("Error updating hotel:", error);
      alert("Failed to update hotel.");
    }
  };
  const handleAddHotel = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${Supplementaries.serverLink}hotels`,
        newHotel
      );
      if (response.status === 201) {
        alert("Hotel added successfully");
        setHotels([...hotels, response.data]);
        setNewHotel({
          name: "",
          location: "",
          description: "",
          imageUrl: "",
        });
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error adding hotel:", error);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="hotel-management">
      <h1>Manage Your Hotels</h1>
      <div>
        <button onClick={openModal}>Add New Hotel</button>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <h2>Add New Hotel</h2>
            <form onSubmit={handleAddHotel}>
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  value={newHotel.name}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Location:
                <input
                  type="text"
                  name="location"
                  value={newHotel.location}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Description:
                <textarea
                  name="description"
                  value={newHotel.description}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Image URL:
                <input
                  type="text"
                  name="imageUrl"
                  value={newHotel.imageUrl}
                  onChange={handleInputChange}
                />
              </label>
              <div className="modal-buttons">
                  <button type="submit">Add Hotel</button>
                  <button type="button" onClick={closeModal}>Cancel</button>
                </div>
            </form>
          </div>
        </div>
      )}
      </div>

      <div className="hotel-list">
        <h2>Your Hotels</h2>
        {/* <button onClick={addHotel(newHotel)}>Add Hotels</button> */}
        {hotels.map((hotel) => (
          <div key={hotel.hotelId} className="hotel-card">
            <img src={hotel.imageUrl} alt={hotel.name} className="hotel-image" />
            <h3>{hotel.name}</h3>
            <p>{hotel.description}</p>
            <p>{hotel.location},</p>
            <button onClick={() => handleEditClick(hotel)}>Edit</button>
          </div>
        ))}
      </div>

      {isEditing && (
        <div className="edit-hotel-form">
          <h2>Edit Hotel Information</h2>
          <input
            type="text"
            name="name"
            placeholder="Hotel Name"
            value={currentHotel.name}
            onChange={handleInputChange}
          />
          <textarea
            name="description"
            placeholder="Description"
            value={currentHotel.description}
            onChange={handleInputChange}
          />
          <input
            type="file"
            onChange={handleImageChange}
          />
          <button onClick={handleUpdateHotel}>Update Hotel</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default HotelManagementPage;
