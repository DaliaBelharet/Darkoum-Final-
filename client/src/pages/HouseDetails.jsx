import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { FaLocationDot, FaImages, FaCoins } from "react-icons/fa6";
import { IoArrowBackCircle, IoArrowBack, IoArrowForward } from "react-icons/io5";
import { PiVirtualRealityBold } from "react-icons/pi";
import Navbar from '../components/Navbar';
import Navbar1 from '../components/Navbar1';
import Footer from '../components/footer';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaHeart,
  FaRegHeart,
} from "react-icons/fa6";

Modal.setAppElement('#root');

const HouseDetails = () => {
  const { id } = useParams();
  const [house, setHouse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const userId = currentUser ? currentUser.user._id : null;
  const [favorites, setFavorites] = useState([]);
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/v1/auth/${userId}`
        );
        setFavorites(response.data.favorites.map((fav) => fav._id));
      } catch (err) {
        console.error("Erreur lors de la récupération des favoris:", err);
      }
    };

    if (userId) {
      fetchFavorites();
    }
  }, [userId]);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    const fetchHouseDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/v1/admin/houses/${id}`);
        setHouse(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHouseDetails();
  }, [id]);

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === house.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? house.images.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'ArrowLeft') {
        handlePrevImage();
      } else if (event.key === 'ArrowRight') {
        handleNextImage();
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleNextImage, handlePrevImage]);

  const handleUpdateFavorite = async (houseId) => {
    try {
      if (!currentUser) {
        toast.error(
          <span style={{ fontSize: "16px" }}>
            Vous devez être connecté pour ajouter ce bien à vos favoris.{" "}
            <Link to="/sign-in" style={{ color: "#F27438" }}>
              Connectez-vous ici
            </Link>
          </span>,
          { autoClose: 8000 }
        );
        return;
      }

      const action = favorites.includes(houseId) ? "remove" : "add";

      await axios.put(
        `http://localhost:5000/api/v1/auth/${userId}/updateFav`,
        { houseId, action },
        { withCredentials: true }
      );

      if (action === "remove") {
        setFavorites(favorites.filter((fav) => fav !== houseId));
        toast.error(
          <span style={{ color: "red" }}>
            Ce bien a été supprimé de vos favoris !
          </span>
        );
      } else {
        setFavorites([...favorites, houseId]);
        toast.success("Ce bien a été ajouté à votre liste de favoris !");
      }
    } catch (err) {
      console.error("Erreur lors de la mise à jour des favoris:", err);
      toast.error(
        "Une erreur est survenue lors de la mise à jour des favoris."
      );
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "120px", fontFamily: "Arial, sans-serif" }}>
        {currentUser ? <Navbar1 /> : <Navbar />}
        <div style={{ fontSize: "24px", marginBottom: "20px" }}>Chargement en cours...</div>
        <FontAwesomeIcon icon={faSpinner} spin style={{ fontSize: "50px", color: "#F27438" }} />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const createdAtDate = new Date(house.createdAt).toLocaleDateString();

  return (
    <div style={{ backgroundColor: "#f0f0f0" }}>
      {currentUser ? <Navbar1 /> : <Navbar />}
      <ToastContainer />
      <div style={{ marginTop: "50px", fontFamily: "Arial, sans-serif", padding: "20px" }}>
        <section style={{ marginBottom: "20px", position: "relative" }}>
          {house.images && house.images.length > 0 && (
            <div style={{ position: "relative" }}>
              <img
                src={house.images[0].url}
                style={{
                  width: "100vw",
                  height: "auto",
                  maxHeight: "80vh",
                  display: "block",
                  borderRadius: "10px",
                  margin: "0 auto"
                }}
                alt="House 1"
              />
              <div style={{
                position: "absolute",
                bottom: "10px",
                right: "20px",
                display: "flex",
                justifyContent: "flex-end"
              }}>
                <button
                  onClick={() => setModalIsOpen(true)}
                  style={{
                    backgroundColor: "black",
                    color: "#FFF",
                    padding: "10px 20px",
                    marginRight: "10px",
                    border: "none",
                    borderRadius: "10px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    fontSize: "18px"
                  }}
                >
                  <FaImages style={{ marginRight: "5px" }} />
                  Afficher les photos
                </button>
                {id === "667aa0364ed2613350e865ce" ? (
                  <Link to={`/houses/${id}/visitt`} target="_blank" style={{ textDecoration: "none" }}>
                    <button
                      style={{
                        backgroundColor: "#F27438",
                        color: "#FFF",
                        padding: "10px 20px",
                        border: "none",
                        borderRadius: "10px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        fontSize: "18px"
                      }}
                    >
                      <PiVirtualRealityBold style={{ marginRight: "5px" }} />
                      Visite 3D
                    </button>
                  </Link>
                ) : id === "667aab774ed2613350e86960" ? (
                  <Link to={`/houses/${id}/visittt`} target="_blank" style={{ textDecoration: "none" }}>
                    <button
                      style={{
                        backgroundColor: "#F27438",
                        color: "#FFF",
                        padding: "10px 20px",
                        border: "none",
                        borderRadius: "10px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        fontSize: "18px"
                      }}
                    >
                      <PiVirtualRealityBold style={{ marginRight: "5px" }} />
                      Visite 3D
                    </button>
                  </Link>
                ) : null}

              </div>
            </div>
          )}
        </section>
        <div style={{ marginBottom: "20px", maxWidth: "800px", margin: "0 100px" }}>
          <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ flex: "1", marginRight: "60px", flexDirection: "column", justifyContent: "space-between" }}>
              <h1 style={{ fontSize: "36px", fontWeight: "bold", color: "#000", marginBottom: "10px" }}>{house.title}
              </h1>
              <div style={{ display: "flex", alignItems: "center" }}>
                <p style={{ fontSize: "24px", display: "flex", alignItems: "center", color: "#000", fontWeight: "bold" }}>
                  <FaLocationDot style={{ marginRight: "5px", color: "#F27438" }} />
                  {house.wilaya}
                </p>
                {house.locationMapLink && (
                  <a href={house.locationMapLink} target="_blank" rel="noopener noreferrer" style={{
                    marginLeft: "10px",
                    fontFamily: "Verdana, sans-serif",
                    fontWeight: "bold",
                    color: "#F27438",
                    textDecoration: "underline",
                    fontSize: "18px",
                  }}>
                    Voir sur la carte
                  </a>
                )}
              </div>
              <p style={{ fontSize: "24px", marginBottom: "10px", color: "#000" }}>
                <strong>Type de bien:</strong> {house.typeBien}
              </p>
              <p style={{ fontSize: "22px", marginBottom: "20px", color: "#000" }}>
                <strong>Type d'annonce:</strong> {house.typeAnnonce}
              </p>
              <p style={{ fontSize: "22px", marginBottom: "10px", color: "#000" }}>
                <strong>Ce bien été ajouté le </strong> {createdAtDate}
              </p>
              <h2 style={{ fontSize: "22px", fontWeight: "bold", color: "#000", marginBottom: "10px" }}>Description</h2>
              <p style={{ fontSize: "18px", color: "#000", fontFamily: "Verdana, sans-serif" }}>{house.description}</p>
            </div>
            <div style={{ textAlign: "right", marginRight: "-400px" }}>
              <p style={{ fontSize: "24px", color: "#000", fontWeight: "bold", marginBottom: "10px", display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                <FaCoins style={{ color: '#F27438', marginRight: '8px' }} />
                {house.price} DA
              </p>
              <div style={{display:"flex", flexDirection:"column", justifyContent:"space-between"}}>
              <button
                    onClick={() => handleUpdateFavorite(house._id)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      position: "absolute",
                      backgroundColor: "white",
                      borderRadius: "50%",
                      padding: "5px",
                      fontSize: "2rem",
                      marginLeft:"-50px"
                    }}
                  >
                    {favorites.includes(house._id) ? (
                      <FaHeart style={{ color: "#F27438" }} />
                    ) : (
                      <FaRegHeart />
                    )}
                  </button>
                  <Link to="/visit" style={{ textDecoration: "none" }}>
                <button style={{ backgroundColor: "#000", color: "#FFF", padding: "10px 20px", fontSize: "20px", border: "none", borderRadius: "10px", cursor: "pointer" }}>
                  Visite sur site
                </button>
              </Link>
              </div>
              
            </div>
          </div>
          <div style={{ textAlign: "right", marginTop: "50px" }}>
            <Link to="/search" style={{ textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
              <IoArrowBackCircle style={{ fontSize: "24px", marginRight: "10px" }} />
              <span style={{ fontSize: "18px", color: "#000", fontWeight: "bold" }}>Retour à la recherche</span>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={{
          content: {
            background: 'rgba(0, 0, 0, 0.5)',
            top: '30%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -30%)',
            width: '80%',
            maxWidth: '800px',
            height: '80vh',
            border: 'none',
            padding: '20px',
            borderRadius: '10px',
            overflow: 'hidden'
          },
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            zIndex: '1000'
          }
        }}
      >
        <div style={{ position: "relative", width: "100%", height: "80%" }}>
          {house.images && house.images.length > 0 && (
            <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
              <img
                src={house.images[currentImageIndex].url}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                  borderRadius: "10px"
                }}
                alt={`House ${currentImageIndex + 1}`}
              />
              <button
                onClick={handlePrevImage}
                style={{
                  position: "absolute",
                  left: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "rgba(0, 0, 0, 0.5)",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  padding: "10px",
                  cursor: "pointer"
                }}
              >
                <IoArrowBack style={{ fontSize: "24px" }} />
              </button>
              <button
                onClick={handleNextImage}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "rgba(0, 0, 0, 0.5)",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  padding: "10px",
                  cursor: "pointer"
                }}
              >
                <IoArrowForward style={{ fontSize: "24px" }} />
              </button>
            </div>
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
          {house.images.map((image, index) => (
            <img
              key={index}
              src={image.url}
              style={{
                width: "100px",
                height: "100px",
                margin: "5px",
                cursor: "pointer",
                border: currentImageIndex === index ? '2px solid #F27438' : 'none',
                objectFit: "cover"
              }}
              alt={`House thumbnail ${index + 1}`}
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default HouseDetails;
