import { useState } from "react";
import {
  Card,
  Button,
  Form,
  Table,
  Navbar,
  Nav,
  Container,
  Modal,
  Pagination,
  Toast,
} from "react-bootstrap";
import {
  Sun,
  Moon,
  Trash,
  Plus,
  Edit,
  Save,
  XCircle,
  Users,
  Award,
  Download,
  ChevronDown,
  Calendar,
} from "react-feather";
import "bootstrap/dist/css/bootstrap.min.css";

const Dashboard = () => {
  const [view, setView] = useState("home");
  const [darkMode, setDarkMode] = useState(false);
  const [students, setStudents] = useState([
    { name: "Tejo", class: "XII RPL", nisn: "1234567890" },
    { name: "Yoru Jamet Jepang", class: "XII RPL", nisn: "1234567891" },
    { name: "Phoenix Kicau Mania", class: "XI TKJ", nisn: "8765432109" },
    
  ]);
  const [ketosList, setKetosList] = useState([
    { name: "Fajar", year: "2024" },
    { name: "Ahmad", year: "2024" },
    { name: "Budi", year: "2024" },
    { name: "Abdillah", year: "2024" },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showAddKetosModal, setShowAddKetosModal] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: "",
    class: "",
    nisn: "",
  });
  const [newKetos, setNewKetos] = useState({ name: "", year: "" });
  const [editStudentIndex, setEditStudentIndex] = useState(null);
  const [editKetosIndex, setEditKetosIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [newActivity, setNewActivity] = useState({
    title: "",
    description: "",
    date: "",
  });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  // const [showError, setShowError] = useState(false);
  // const [errorMsg, setErrorMsg] = useState("");
  // const [showSuccess, setShowSuccess] = useState(false);
  // const [successMsg, setSuccessMsg] = useState("");
  // const [showWarning, setShowWarning] = useState(false);
  // const [warningMsg, setWarningMsg] = useState("");
  // const [showInfo, setShowInfo] = useState(false);
  // const [infoMsg, setInfoMsg] = useState("");
  // const [showDanger, setShowDanger] = useState(false);
  // const [dangerMsg, setDangerMsg] = useState("");
  // const [showPrimary, setShowPrimary] = useState(false);
  const itemsPerPage = 5;

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleDeleteStudent = (index) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      setStudents((prevStudents) => prevStudents.filter((_, i) => i !== index));
      showNotificationMessage("Student deleted successfully!");
    }
  };
  const handleSaveStudent = () => {
    if (
      !newStudent.name.trim() ||
      !newStudent.class.trim() ||
      !newStudent.nisn.trim()
    ) {
      alert("Please fill all fields!");
      return;
    }
    if (editStudentIndex !== null) {
      const updatedStudents = [...students];
      updatedStudents[editStudentIndex] = newStudent;
      setStudents(updatedStudents);
      setEditStudentIndex(null);
      showNotificationMessage("Student updated successfully!");
    } else {
      setStudents((prevStudents) => [...prevStudents, newStudent]);
      showNotificationMessage("Student added successfully!");
    }
    setNewStudent({ name: "", class: "", nisn: "" });
    setShowAddStudentModal(false);
  };
  const handleSaveKetos = () => {
    if (!newKetos.name.trim() || !newKetos.year.trim()) {
      alert("Please fill all fields!");
      return;
    }
    if (editKetosIndex !== null) {
      const updatedKetosList = [...ketosList];
      updatedKetosList[editKetosIndex] = newKetos;
      setKetosList(updatedKetosList);
      setEditKetosIndex(null);
      showNotificationMessage("Ketos udah di update datanya!");
    } else {
      setKetosList((prevKetosList) => [...prevKetosList, newKetos]);
      showNotificationMessage("Ketos udah ditambahin!");
    }
    setNewKetos({ name: "", year: "" });
    setShowAddKetosModal(false);
  };
  const filteredStudents = students.filter((siswa) =>
    siswa.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (sortConfig.key) {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
    }
    return 0;
  });
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudents = sortedStudents.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
 // import csv 
  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Name,Class,NISN\n" +
      students
        .map((student) => `${student.name},${student.class},${student.nisn}`)
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "studentsData.csv");
    document.body.appendChild(link);
    link.click();
    showNotificationMessage("Exported to CSV successfully!");
  };
  // Delete activity
  const handleDeleteActivity = (index) => {
    if (window.confirm("Are you sure you want to delete this activity?")) {
      const updatedActivities = [...activities];
      updatedActivities.splice(index, 1);
      setActivities(updatedActivities);
      showNotificationMessage("Activity deleted successfully!");
    }
  };

  // Add activity
  const handleAddActivity = () => {
    if (!newActivity.title.trim() ||!newActivity.description.trim() ||!newActivity.date.trim()) {
      alert("Please fill all fields!");
      return;
    }
    setActivities((prevActivities) => [...prevActivities, newActivity]);
    setNewActivity({ title: "", description: "", date: "" });
    setShowAddActivityModal(false);
  };

  // Edit activity
  // Export to CSV
  const exportToCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Name,Class,NISN\n" +
      students
        .map((student) => `${student.name},${student.class},${student.nisn}`)
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "studentsData.csv");
    document.body.appendChild(link);
    link.click();
    showNotificationMessage("Exported to CSV successfully!");
  };
  const showNotificationMessage = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };
  return (
    <div
      className={
        darkMode
          ? "bg-dark text-white min-vh-100 p-3"
          : "bg-light text-dark min-vh-100 p-3"
      }
    >
      {/* Notification Toast */}
      <Toast
        onClose={() => setShowNotification(false)}
        show={showNotification}
        delay={3000}
        autohide
        className="position-fixed top-0 end-0 m-3"
        bg={darkMode ? "light" : "dark"}
      >
        <Toast.Body className={darkMode ? "text-dark" : "text-white"}>
          {notificationMessage}
        </Toast.Body>
      </Toast>

      {/* Navbar */}
      <Navbar
        bg={darkMode ? "dark" : "light"}
        variant={darkMode ? "dark" : "light"}
        expand="lg"
        className="mb-4 shadow"
      >
        <Container fluid>
          {/* <i class="bi bi-battery-full"></i>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-battery-full"
            viewBox="0 0 16 16"
          >
            <path d="M2 6h10v4H2z" />
            <path d="M2 4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm10 1a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm4 3a1.5 1.5 0 0 1-1.5 1.5v-3A1.5 1.5 0 0 1 16 8" />
          </svg> */}
          <Navbar.Brand href="#" className="fw-bold">
            <span className="text-primary">E-Votesis</span>.DB
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link onClick={() => setView("home")} className="mx-2">
                Home
              </Nav.Link>
              <Nav.Link onClick={() => setView("listSiswa")} className="mx-2">
                List Siswa
              </Nav.Link>
              <Nav.Link onClick={() => setView("listKetos")} className="mx-2">
                List Ketos
              </Nav.Link>
            </Nav>
            <Button
              variant={darkMode ? "light" : "dark"}
              className="ms-2"
              onClick={toggleDarkMode}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {/* Home View */}
      {view === "home" && (
        <Container fluid>
               {/* <Clock
                className="mb-3"
                style={{
                  width: "150px",
                  height: "150px",
                  background: "transparent",
                  border: "none",
                }}
                timeZone="Asia/Jakarta"
                format="HH:mm:ss"
              />
              <p>
                <i class="bi bi-clock"></i>
                <span className="fw-bold">
                  {new Date().toLocaleString("id-ID", {
                    timeZone: "Asia/Jakarta",
                    hour12: false,
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric",
                  })}
                </span>{" "}
                WIB
              </p> */}
          {/* <div className="text-center">
            <h1 className="display-3">E-Votesis.DB</h1>
            <p className="lead">Aplikasi E-Voting Online Sederhana</p>
          </div> */}
          {/* <h2 className="display-4">Welcome, {namaKetua}</h2>s */}
            {/* <h2 className="display-4">Clock</h2> */}
      
          <Card className="p-4 shadow-lg text-center mb-4 bg-gradient-primary">
            <h3 className="fw-bold">Selamat Datang, Aries-san ♡</h3>
            <p className="mb-0">
              Gunakan navigasi di atas untuk mengelola data siswa dan ketua
              OSIS.
            </p>
          </Card>
          <div className="row g-4">
            <div className="col-md-6">
              <Card className="p-3 text-center shadow h-100">
                <Card.Body>
                  <Users size={48} className="text-primary mb-3" />
                  <h5>Total Siswa</h5>
                  <h2 className="fw-bold">{students.length}</h2>
                </Card.Body>
              </Card>
            </div>
            <div className="col-md-6">
              <Card className="p-3 text-center shadow h-100">
                <Card.Body>
                  <Award size={48} className="text-success mb-3" />
                  <h5>Total Calon Ketos</h5>
                  <h2 className="fw-bold">{ketosList.length}</h2>
                </Card.Body>
              </Card>
            </div>
            <div className="col-md-6">
              <Card className="p-3 text-center shadow h-100">
                <Card.Body>
                  <Calendar size={48} className="text-danger mb-3" />
                  <h5>Jadwal Pemilihan Ketua OSIS</h5>
                  <h2 className="fw-bold">Tanggal: 15 Februari 2025</h2>
                </Card.Body>
              </Card>
            </div>
          </div>
          <Card className="mt-4 p-4 shadow-lg rounded-2xl">
            <div className="flex items-center gap-2 mb-3">
              <h5 className="font-bold text-lg"> [ ⛮ ] Aktivitas Terbaru</h5>
              <div>
                <Button
                  variant="primary"
                  onClick={() => {
                    setNewActivity({ title: "", description: "", date: "" });
                    setEditActivityIndex(null);
                    setShowAddActivityModal(true);
                  }}
                  className="me-2"
                >
                  <Plus size={19} className="me-2w" /> Tambah Aktivitas
                </Button>
              </div>
              <div class=" panel-primary">
                <div class="panel-heading">
                  <div class="panel-tools">
                    <a
                      href="#"
                      data-toggle="collapse"
                      data-target="#collapseOne"
                      aria-expanded="true"
                      aria-controls="collapseOne"
                    >
                      <i class="bi bi-chevron-down">
                      </i>
                    </a>
                  </div>
                  <div class="collapse" id="collapseOne">
                    <table class="table table-hover">
                      <thead>
                        <tr>
                          <th>No.</th>
                          <th>Judul</th>
                          <th>Deskripsi</th>
                          <th>Tanggal</th>
                          <th></th>
                        </tr>
                      </thead>
                    </table>
                  </div>
              </div>
              </div>
            </div>
            {/* Card-Info  */}
            <div className="container mt-4">
      <table className="table table-hover text-center">
        <thead>
          <tr>
            <th colSpan="2">
              <h1 className="p-3 mt-4 text-center text-primary  shadow h-300 rounded-3xl ">📖 Visi & Misi Calon Ketos 2099</h1>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            {students.map((student, index) => (
              <td key={index}>
                <div className="card text-center shadow-lg p-3 mb-4 bg-white rounded"> 
                  <img
                    src={student.img}
                    className="card-img-top rounded-circle mx-auto d-block mt-3"
                    alt={student.name}
                    style={{ width: "120px", height: "120px" }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{student.name}</h5>
                  </div>
                </div>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
          </Card>
        </Container>
      )}

      {/* List Siswa View */}
      {view === "listSiswa" && (
        <Container fluid>
          <div className="d-flex flex-column flex-md-row justify-content-between mb-3">
            <Form.Control
              type="text"
              placeholder="Cari siswa... (Pisahkan dengan , )"
              value={searchTerm}
              onChange={(e) => setSearchTerm(ze.target.value)}
              className="
              mb-3
              mb-md-0
               
               "
              style={{ maxWidth: "1000px" }}
            />
            <div>
              <Button
                variant="primary"
                onClick={() => {
                  setNewStudent({ name: "", class: "", nisn: "" });
                  setEditStudentIndex(null);
                  setShowAddStudentModal(true);
                }}
                className="me-2"
              >
                <Plus size={16} className="me-2" /> Tambah Siswa
              </Button>
              <Button variant="danger" onClick={deleteSelectedStudents}>
                <Trash size={16} className="me-2" /> Hapus Siswa
              </Button>
              <Button variant="info" onClick={importFromCSV}>
                <Upload size={16} className="me-2" /> Import CSV
              </Button>
              <Button variant="success" onClick={exportToCSV}>
                <Download size={16} className="me-2" /> Export CSV
              </Button>
            </div>
          </div>
          <Table
            striped
            bordered
            hover
            responsive
            className="
          shadow-sm
            rounded-2xl
            table-hover
            table-sm
          "
          >
            <thead className={darkMode ? "table-dark" : "table-light"}>
              <tr>
                <th
                  onClick={() => requestSort("name")}
                  style={{ cursor: "pointer" }}
                >
                  Nama <ChevronDown size={16} />
                </th>
                <th
                  onClick={() => requestSort("class")}
                  style={{ cursor: "pointer" }}
                >
                  Kelas <ChevronDown size={16} />
                </th>
                <th>NISN</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {currentStudents.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center">
                    Tidak ada data siswa
                  </td>
                </tr>
              ) : (
                currentStudents.map((siswa, index) => (
                  <tr key={index}>
                    <td>{siswa.name}</td>
                    <td>{siswa.class}</td>
                    <td>{siswa.nisn}</td>
                    <td>
                      <Button
                        variant="warning"
                        size="sm"
                        className="me-2"
                        onClick={() => {
                          setNewStudent(siswa);
                          setEditStudentIndex(index);
                          setShowAddStudentModal(true);
                        }}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteStudent(index)}
                      >
                        <Trash size={16} />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
          <Pagination className="mt-3 justify-content-center">
            {[
              ...Array(
                Math.ceil(filteredStudents.length / itemsPerPage)
              ).keys(),
            ].map((number) => (
              <Pagination.Item
                key={number + 1}
                active={number + 1 === currentPage}
                onClick={() => paginate(number + 1)}
              >
                {number + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </Container>
      )}

      {/* List Ketos View */}
      {view === "listKetos" && (
        <Container fluid>
          <div className="d-flex justify-content-between mb-3">
            <Button
              variant="primary"
              onClick={() => {
                setNewKetos({ name: "", year: "" });
                setEditKetosIndex(null);
                setShowAddKetosModal(true);
              }}
            >
              <Plus size={16} className="me-2" /> Tambah Ketos
            </Button>
          </div>
          <Table striped bordered hover responsive className="shadow-sm">
            <thead className={darkMode ? "table-dark" : "table-light"}>
              <tr>
                <th>Nama</th>
                <th>Tahun</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {ketosList.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center">
                    Tidak ada data ketos
                  </td>
                </tr>
              ) : (
                ketosList.map((ketos, index) => (
                  <tr key={index}>
                    <td>{ketos.name}</td>
                    <td>{ketos.year}</td>
                    <td>
                      <Button
                        variant="warning"
                        size="sm"
                        className="me-2"
                        onClick={() => {
                          setNewKetos(ketos);
                          setEditKetosIndex(index);
                          setShowAddKetosModal(true);
                        }}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteStudent(index)}
                      >
                        <Trash size={16} />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Container>
      )}

      {/* Add/Edit Student Modal */}
      <Modal
        show={showAddStudentModal}
        onHide={() => setShowAddStudentModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {editStudentIndex !== null ? "Edit Siswa" : "Tambah Siswa Baru"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nama</Form.Label>
              <Form.Control
                type="text"
                placeholder="Masukkan nama"
                value={newStudent.name}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Kelas</Form.Label>
              <Form.Control
                type="text"
                placeholder="Masukkan kelas"
                value={newStudent.class}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, class: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>NISN</Form.Label>
              <Form.Control
                type="text"
                placeholder="Masukkan NISN"
                value={newStudent.nisn}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, nisn: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowAddStudentModal(false)}
          >
            <XCircle size={16} className="me-2" /> Batal
          </Button>
          <Button variant="primary" onClick={handleSaveStudent}>
            <Save size={16} className="me-2" /> Simpan
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add/Edit Ketos Modal */}
      <Modal
        show={showAddKetosModal}
        onHide={() => setShowAddKetosModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {editKetosIndex !== null ? "Edit Ketos" : "Tambah Ketos Baru"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nama</Form.Label>
              <Form.Control
                type="text"
                placeholder="Masukkan nama"
                value={newKetos.name}
                onChange={(e) =>
                  setNewKetos({ ...newKetos, name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tahun</Form.Label>
              <Form.Control
                type="text"
                placeholder="Masukkan tahun"
                value={newKetos.year}
                onChange={(e) =>
                  setNewKetos({ ...newKetos, year: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowAddKetosModal(false)}
          >
            <XCircle size={16} className="me-2" /> Batal
          </Button>
          <Button variant="primary" onClick={handleSaveKetos}>
            <Save size={16} className="me-2" /> Simpan
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Dashboard;
