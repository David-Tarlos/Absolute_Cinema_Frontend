'use client';

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    Box,
    Typography,
    TextField,
    Button,
    Grid,
    Card,
    CardContent,
    Alert,
    CircularProgress,
    Divider,
} from "@mui/material";
import { CreditCard, Lock } from "@mui/icons-material";

export default function PaymentPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Get payment details from URL params
    const movieTitle = searchParams.get('movieTitle') || 'Movie';
    const seats = searchParams.get('seats') || '';
    const total = searchParams.get('total') || '0';
    const screeningTime = searchParams.get('screeningTime') || '';
    const roomNumber = searchParams.get('roomNumber') || '';

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    // Form state
    const [formData, setFormData] = useState({
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: '',
        email: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Format card number with spaces
        if (name === 'cardNumber') {
            const formatted = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
            setFormData(prev => ({ ...prev, [name]: formatted }));
        }
        // Format expiry date
        else if (name === 'expiryDate') {
            const formatted = value.replace(/\D/g, '').replace(/(\d{2})(\d{0,2})/, '$1/$2').substr(0, 5);
            setFormData(prev => ({ ...prev, [name]: formatted }));
        }
        // Limit CVV to 3 digits
        else if (name === 'cvv') {
            const formatted = value.replace(/\D/g, '').substr(0, 3);
            setFormData(prev => ({ ...prev, [name]: formatted }));
        }
        else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validate form
        if (!formData.cardNumber || !formData.cardName || !formData.expiryDate || !formData.cvv || !formData.email) {
            setError('Please fill in all fields');
            setLoading(false);
            return;
        }

        // Simulate payment processing
        setTimeout(() => {
            setLoading(false);
            setSuccess(true);

            // Redirect to success page after 2 seconds
            setTimeout(() => {
                router.push('/overview');
            }, 2000);
        }, 2000);
    };

    if (success) {
        return (
            <Box sx={{
                backgroundColor: "#36304E",
                minHeight: "100vh",
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 4,
            }}>
                <Card sx={{ maxWidth: 500, textAlign: 'center', p: 4 }}>
                    <Box sx={{ fontSize: 60, mb: 2 }}></Box>
                    <Typography variant="h4" gutterBottom fontWeight="bold" color="success.main">
                        Payment Successful!
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                        Your booking has been confirmed. A confirmation email has been sent to {formData.email}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Redirecting to home...
                    </Typography>
                </Card>
            </Box>
        );
    }

    return (
        <Box sx={{
            backgroundColor: "#36304E",
            minHeight: "100vh",
            padding: 4,
        }}>
            <Grid container spacing={4} justifyContent="center">
                {/* Left Side - Order Summary */}
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5" fontWeight="bold" gutterBottom>
                                Order Summary
                            </Typography>
                            <Divider sx={{ my: 2 }} />

                            <Typography variant="h6" gutterBottom>
                                {movieTitle}
                            </Typography>

                            {screeningTime && (
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    {new Date(screeningTime).toLocaleString('en-US', {
                                        weekday: 'short',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </Typography>
                            )}

                            {roomNumber && (
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Room {roomNumber}
                                </Typography>
                            )}

                            {seats && (
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Seats: {seats}
                                </Typography>
                            )}

                            <Divider sx={{ my: 2 }} />

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body1">
                                    Subtotal:
                                </Typography>
                                <Typography variant="body1">
                                    ${total}
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Typography variant="body1">
                                    Booking Fee:
                                </Typography>
                                <Typography variant="body1">
                                    $2.00
                                </Typography>
                            </Box>

                            <Divider sx={{ mb: 2 }} />

                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="h6" fontWeight="bold">
                                    Total:
                                </Typography>
                                <Typography variant="h6" fontWeight="bold">
                                    ${(parseFloat(total) + 2.0).toFixed(2)}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Right Side - Payment Form */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <Lock sx={{ mr: 1, color: 'success.main' }} />
                                <Typography variant="h5" fontWeight="bold">
                                    Secure Payment
                                </Typography>
                            </Box>

                            {error && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    {error}
                                </Alert>
                            )}

                            <form onSubmit={handleSubmit}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    sx={{ mb: 3 }}
                                />

                                <TextField
                                    fullWidth
                                    label="Cardholder Name"
                                    name="cardName"
                                    value={formData.cardName}
                                    onChange={handleInputChange}
                                    required
                                    sx={{ mb: 3 }}
                                />

                                <TextField
                                    fullWidth
                                    label="Card Number"
                                    name="cardNumber"
                                    value={formData.cardNumber}
                                    onChange={handleInputChange}
                                    placeholder="1234 5678 9012 3456"
                                    required
                                    inputProps={{ maxLength: 19 }}
                                    InputProps={{
                                        startAdornment: <CreditCard sx={{ mr: 1, color: 'action.active' }} />
                                    }}
                                    sx={{ mb: 3 }}
                                />

                                <Grid container spacing={2} sx={{ mb: 3 }}>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            label="Expiry Date"
                                            name="expiryDate"
                                            value={formData.expiryDate}
                                            onChange={handleInputChange}
                                            placeholder="MM/YY"
                                            required
                                            inputProps={{ maxLength: 5 }}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            label="CVV"
                                            name="cvv"
                                            value={formData.cvv}
                                            onChange={handleInputChange}
                                            placeholder="123"
                                            required
                                            type="password"
                                            inputProps={{ maxLength: 3 }}
                                        />
                                    </Grid>
                                </Grid>

                                <Button
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    disabled={loading}
                                    sx={{
                                        backgroundColor: '#4CAF50',
                                        '&:hover': {
                                            backgroundColor: '#45a049',
                                        },
                                        padding: '14px',
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                        mb: 2,
                                    }}
                                >
                                    {loading ? (
                                        <CircularProgress size={24} color="inherit" />
                                    ) : (
                                        `Pay $${(parseFloat(total) + 2.0).toFixed(2)}`
                                    )}
                                </Button>

                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="caption" color="text.secondary">
                                        Your payment information is secure and encrypted
                                    </Typography>
                                </Box>
                            </form>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
