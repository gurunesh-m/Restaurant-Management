import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { CalendarCheck, Users, Clock, User, Phone, Mail, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TABLES = [
    { id: 1, seats: 2, status: 'available', x: 20, y: 20 },
    { id: 2, seats: 2, status: 'available', x: 20, y: 50 },
    { id: 3, seats: 4, status: 'booked', x: 50, y: 20 },
    { id: 4, seats: 4, status: 'available', x: 50, y: 50 },
    { id: 5, seats: 6, status: 'available', x: 80, y: 35 },
    { id: 6, seats: 2, status: 'available', x: 20, y: 80 },
    { id: 7, seats: 4, status: 'available', x: 50, y: 80 },
    { id: 8, seats: 8, status: 'booked', x: 80, y: 80 },
];

const Reservation = () => {
    const [selectedTable, setSelectedTable] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        customer_name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        special_requests: ''
    });
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTable) return;
        setStatus('submitting');

        // Simulate API call
        setTimeout(() => {
            setStatus('success');
            // Hide the modal after success
            setTimeout(() => {
                setStatus('idle');
                setSelectedTable(null);
                setFormData({
                    customer_name: '',
                    email: '',
                    phone: '',
                    date: '',
                    time: '',
                    special_requests: ''
                });
            }, 3000);
        }, 1500);
    };

    const handleTableClick = (tableId: number, status: string) => {
        if (status === 'available') {
            setSelectedTable(tableId);
            setStatus('idle'); // reset previous success if any
        }
    };

    return (
        <div className="reservation-page min-h-screen py-20 mt-10 relative">
            <Container className={selectedTable ? 'blur-sm transition-all duration-300 pointer-events-none' : 'transition-all duration-300'}>
                <div className="text-center mb-10">
                    <span className="section-subtitle mb-3 fade-in d-inline-block text-[var(--primary-color)]">Interactive Booking</span>
                    <h1 className="section-title display-4 brand-font text-[var(--text-main)] mb-4">Select Your Table</h1>
                    <p className="text-[var(--text-muted)] max-w-xl mx-auto text-lg pt-4 pb-2">
                        Pick your preferred table from our floor plan below to begin your reservation.
                    </p>
                </div>

                <div className="relative w-full max-w-4xl mx-auto h-[600px] bg-[var(--bg-light)] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] rounded-3xl shadow-2xl p-8 overflow-hidden">
                    <div className="absolute top-6 left-6 flex gap-4 text-sm text-[var(--text-muted)] z-10">
                        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-green-500/20 border-2 border-green-500" /> Available</div>
                        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-red-500/20 border-2 border-red-500" /> Booked</div>
                    </div>
                    {/* Interactive Floor Plan */}
                    <div className="absolute inset-x-8 inset-y-20 border-2 border-dashed border-[var(--text-muted)] opacity-20 rounded-xl pointer-events-none"></div>
                    <div className="absolute top-1/2 left-0 -translate-y-1/2 -ml-2 text-[var(--text-muted)] opacity-50 font-bold rotate-90 uppercase tracking-widest">Entrance</div>

                    {TABLES.map((table) => (
                        <motion.button
                            key={table.id}
                            whileHover={table.status === 'available' ? { scale: 1.05 } : {}}
                            whileTap={table.status === 'available' ? { scale: 0.95 } : {}}
                            onClick={() => handleTableClick(table.id, table.status)}
                            className={`absolute flex flex-col items-center justify-center rounded-full transition-colors shadow-lg
                                ${table.status === 'available'
                                    ? 'bg-green-500/10 border-2 border-green-500 hover:bg-green-500 hover:text-white cursor-pointer text-green-700 dark:text-green-400'
                                    : 'bg-red-500/10 border-2 border-red-500 cursor-not-allowed opacity-60 text-red-700 dark:text-red-400'}
                            `}
                            style={{
                                left: `${table.x}%`,
                                top: `${table.y}%`,
                                width: table.seats > 4 ? '100px' : '80px',
                                height: table.seats > 4 ? '100px' : '80px',
                                transform: 'translate(-50%, -50%)' // center it on the coordinate
                            }}
                            title={`Table ${table.id} (${table.seats} seats) - ${table.status}`}
                        >
                            <span className="font-bold text-lg">T{table.id}</span>
                            <span className="text-xs opacity-80 flex items-center gap-1"><Users size={12} />{table.seats}</span>
                        </motion.button>
                    ))}
                </div>
            </Container>

            {/* Booking Overlay Modal */}
            <AnimatePresence>
                {selectedTable && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 pt-20"
                    >
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={() => setSelectedTable(null)}></div>

                        <div className="relative w-full max-w-2xl bg-[var(--bg-light)] p-8 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.3)] border border-border overflow-y-auto max-h-[90vh]">
                            <button
                                onClick={() => setSelectedTable(null)}
                                className="absolute top-6 right-6 p-2 rounded-full hover:bg-[var(--bg-dark)] transition-colors text-[var(--text-muted)]"
                            >
                                <X size={24} />
                            </button>

                            <div className="mb-8">
                                <h2 className="text-3xl brand-font text-[var(--text-main)] mb-2">Complete Reservation</h2>
                                <p className="text-[var(--text-muted)]">You're booking Table {selectedTable} (Seats: {TABLES.find(t => t.id === selectedTable)?.seats})</p>
                            </div>

                            {status === 'success' && (
                                <Alert variant="success" className="d-flex align-items-center gap-2 border-0 bg-green-500/10 text-green-600 dark:text-green-400 mb-6">
                                    <CalendarCheck size={24} />
                                    <div>
                                        <strong>Success!</strong> Your table is booked for {formData.date} at {formData.time}. Redirecting...
                                    </div>
                                </Alert>
                            )}

                            {status === 'error' && (
                                <Alert variant="danger" className="mb-6">
                                    An error occurred while booking. Please try again later.
                                </Alert>
                            )}

                            <Form onSubmit={handleSubmit}>
                                <Row className="gy-4">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label className="d-flex align-items-center gap-2 text-[var(--text-main)] fw-bold mb-2">
                                                <User size={16} /> Full Name
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="customer_name"
                                                value={formData.customer_name}
                                                onChange={handleChange}
                                                required
                                                placeholder="John Doe"
                                                className="bg-[var(--bg-dark)] border-border text-[var(--text-main)] p-3 rounded-xl focus:ring-2 focus:ring-[var(--primary-color)]"
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label className="d-flex align-items-center gap-2 text-[var(--text-main)] fw-bold mb-2">
                                                <Mail size={16} /> Email Address
                                            </Form.Label>
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                placeholder="john@example.com"
                                                className="bg-[var(--bg-dark)] border-border text-[var(--text-main)] p-3 rounded-xl focus:ring-2 focus:ring-[var(--primary-color)]"
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label className="d-flex align-items-center gap-2 text-[var(--text-main)] fw-bold mb-2">
                                                <Phone size={16} /> Phone Number
                                            </Form.Label>
                                            <Form.Control
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                required
                                                placeholder="(555) 123-4567"
                                                className="bg-[var(--bg-dark)] border-border text-[var(--text-main)] p-3 rounded-xl focus:ring-2 focus:ring-[var(--primary-color)]"
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label className="d-flex align-items-center gap-2 text-[var(--text-main)] fw-bold mb-2">
                                                <CalendarCheck size={16} /> Date
                                            </Form.Label>
                                            <Form.Control
                                                type="date"
                                                name="date"
                                                value={formData.date}
                                                onChange={handleChange}
                                                required
                                                min={new Date().toISOString().split('T')[0]}
                                                className="bg-[var(--bg-dark)] border-border text-[var(--text-main)] p-3 rounded-xl focus:ring-2 focus:ring-[var(--primary-color)] [&::-webkit-calendar-picker-indicator]:dark:invert"
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label className="d-flex align-items-center gap-2 text-[var(--text-main)] fw-bold mb-2">
                                                <Clock size={16} /> Time
                                            </Form.Label>
                                            <Form.Select
                                                name="time"
                                                value={formData.time}
                                                onChange={handleChange}
                                                required
                                                className="bg-[var(--bg-dark)] border-border text-[var(--text-main)] p-3 rounded-xl focus:ring-2 focus:ring-[var(--primary-color)]"
                                            >
                                                <option value="">Select Time</option>
                                                <option value="17:00">5:00 PM</option>
                                                <option value="17:30">5:30 PM</option>
                                                <option value="18:00">6:00 PM</option>
                                                <option value="18:30">6:30 PM</option>
                                                <option value="19:00">7:00 PM</option>
                                                <option value="19:30">7:30 PM</option>
                                                <option value="20:00">8:00 PM</option>
                                                <option value="20:30">8:30 PM</option>
                                                <option value="21:00">9:00 PM</option>
                                                <option value="21:30">9:30 PM</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>

                                    <Col md={6}>
                                        {/* Display only, tied to table */}
                                        <Form.Group>
                                            <Form.Label className="d-flex align-items-center gap-2 text-[var(--text-main)] fw-bold mb-2">
                                                <Users size={16} /> Table Capacity
                                            </Form.Label>
                                            <div className="bg-[var(--bg-dark)] border border-border text-[var(--text-muted)] p-3 rounded-xl">
                                                {TABLES.find(t => t.id === selectedTable)?.seats} Guests Max
                                            </div>
                                        </Form.Group>
                                    </Col>

                                    <Col xs={12}>
                                        <Form.Group>
                                            <Form.Label className="text-[var(--text-main)] fw-bold mb-2">Special Requests (Optional)</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
                                                name="special_requests"
                                                value={formData.special_requests}
                                                onChange={handleChange}
                                                placeholder="Allergies, anniversaries, preferred seating..."
                                                className="bg-[var(--bg-dark)] border-border text-[var(--text-main)] p-3 rounded-xl focus:ring-2 focus:ring-[var(--primary-color)]"
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col xs={12} className="text-center mt-6">
                                        <Button
                                            type="submit"
                                            className="btn-gold btn-lg w-full py-4 text-uppercase fw-bold shadow-lg rounded-xl text-lg hover:bg-transparent hover:text-[var(--primary-color)]"
                                            disabled={status === 'submitting'}
                                            style={{ backgroundColor: 'var(--primary-color)', color: 'white', borderColor: 'var(--primary-color)' }}
                                        >
                                            {status === 'submitting' ? 'Confirming...' : 'Confirm Reservation'}
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Reservation;
