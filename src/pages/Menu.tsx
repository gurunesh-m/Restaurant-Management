import { useState } from 'react';
import { Container, Row, Col, Nav, Badge } from 'react-bootstrap';

const dummyMenu = [
    // Appetizers
    { id: 1, name: "Crispy Calamari", description: "Lightly dusted with smoked paprika, served with lemon aioli.", price: "$16.00", category: "Appetizers", image_url: "https://images.unsplash.com/photo-1599487405270-b0fa93f669cc?auto=format&fit=crop&q=80", is_available: true },
    { id: 2, name: "Bruschetta Tower", description: "Heirloom tomatoes, fresh basil, garlic, and balsamic glaze on toasted sourdough.", price: "$12.00", category: "Appetizers", image_url: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&q=80", is_available: true },
    { id: 3, name: "Beef Carpaccio", description: "Thinly sliced raw beef tenderloin, arugula, capers, and Grana Padano.", price: "$19.00", category: "Appetizers", image_url: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80", is_available: true },
    // Mains
    { id: 4, name: "Pan-Seared Salmon", description: "Wild-caught salmon with asparagus, quinoa, and lemon-dill sauce.", price: "$34.00", category: "Mains", image_url: "https://images.unsplash.com/photo-1485921325833-c519f76c4927?auto=format&fit=crop&q=80", is_available: true },
    { id: 5, name: "Classic Filet Mignon", description: "Grass-fed 8oz filet, roasted garlic mash, and red wine reduction.", price: "$48.00", category: "Mains", image_url: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&q=80", is_available: true },
    { id: 6, name: "Wild Mushroom Risotto", description: "Arborio rice, porcini mushrooms, truffle oil, and parmesan crisp.", price: "$26.00", category: "Mains", image_url: "https://images.unsplash.com/photo-1590453535234-7a329fa03db5?auto=format&fit=crop&q=80", is_available: true },
    // Desserts
    { id: 7, name: "Tiramisu Classico", description: "Espresso-soaked ladyfingers, mascarpone cream, and cocoa powder.", price: "$12.00", category: "Desserts", image_url: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&q=80", is_available: true },
    { id: 8, name: "Lemon Basil Tart", description: "Crisp pastry shell filled with tangy lemon curd and fresh basil.", price: "$10.00", category: "Desserts", image_url: "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&q=80", is_available: true }
];

const Menu = () => {
    const [activeTab, setActiveTab] = useState("Appetizers");

    const categories = ["Appetizers", "Mains", "Desserts"];

    // Filter items based on selected category
    const filteredMenu = dummyMenu.filter(item => item.category === activeTab);

    return (
        <div className="menu-page">
            <div className="pt-5 mt-5">
                <Container className="py-5">
                    <div className="text-center mb-5">
                        <span className="section-subtitle">Exquisite Tastes</span>
                        <h1 className="section-title display-4 brand-font">Our Menu</h1>
                    </div>

                    <Nav variant="pills" className="justify-content-center mb-5 border-bottom border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] pb-3 gap-3">
                        {categories.map((cat, idx) => (
                            <Nav.Item key={idx}>
                                <Nav.Link
                                    className={`btn-outline-gold rounded-pill border px-4 py-2 ${activeTab === cat ? 'active bg-[var(--primary-color)] text-[var(--bg-dark)]' : 'text-[var(--text-main)] border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]'}`}
                                    style={activeTab === cat ? { backgroundColor: 'var(--primary-color)', borderColor: 'var(--primary-color)', color: 'var(--bg-dark) !important', fontWeight: '600' } : { cursor: 'pointer' }}
                                    onClick={() => setActiveTab(cat)}
                                >
                                    {cat}
                                </Nav.Link>
                            </Nav.Item>
                        ))}
                    </Nav>

                    <Row className="gy-4">
                        {filteredMenu.map((item) => (
                            <Col lg={6} key={item.id}>
                                <div className="d-flex flex-column flex-sm-row gap-3 p-3 menu-card align-items-sm-center">
                                    <div style={{ width: '120px', height: '120px', flexShrink: 0 }} className="overflow-hidden rounded">
                                        <img
                                            src={item.image_url}
                                            alt={item.name}
                                            className="w-100 h-100 object-fit-cover"
                                            style={{ objectFit: 'cover' }}
                                        />
                                    </div>
                                    <div className="flex-grow-1 text-start">
                                        <div className="d-flex justify-content-between align-items-center mb-2 border-bottom border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] pb-2">
                                            <h4 className="brand-font mb-0 text-[var(--text-main)] d-flex align-items-center gap-2">
                                                {item.name}
                                                {!item.is_available && <Badge bg="danger" className="fs-6 fw-normal ms-2">Sold Out</Badge>}
                                            </h4>
                                            <span className="price-tag fs-5">{item.price}</span>
                                        </div>
                                        <p className="text-[var(--text-muted)] mb-0 lh-sm">{item.description}</p>
                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>

                    {filteredMenu.length === 0 && (
                        <div className="text-center py-5 text-muted">
                            <p>No items found in this category.</p>
                        </div>
                    )}
                </Container>
            </div>
        </div>
    );
};

export default Menu;
