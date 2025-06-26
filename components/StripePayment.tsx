// import type { CardFieldInput } from '@stripe/stripe-react-native';
// import { CardField, useConfirmPayment } from '@stripe/stripe-react-native';
// import React, { useState } from 'react';
// import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
// const Stripe = () => {
//     const [email, setEmail] = useState<string | null>(null);
//     const [cardDetail, setCardDetail] = useState<CardFieldInput.Details | null>(null);
//     const { confirmPayment, loading } = useConfirmPayment();

//     const fetchPaymentClientSecret = async () => {
//         const response = await fetch('http://192.168.1.2:3000/stripe-payment/payment-secret', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         });
//         const { clientSecret, error } = await response.json();
//         return { clientSecret, error };

//     }

//     const handlePayment = async () => {
//         if (!cardDetail?.complete || !email) {
//             alert('Please fill all the fields');
//             return;
//         };
//         const paymentDetails = {
//             email: email,
//         }
//         try {
//             const { clientSecret, error } = await fetchPaymentClientSecret();
//             if (error) {
//                 console.log("Unable to process payment", error);
//             } else {
//                 const { paymentIntent, error } = await confirmPayment(clientSecret, {
//                     paymentMethodType: 'Card',
//                     paymentMethodData: {
//                         billingDetails: {
//                             email: email
//                         }
//                     }
//                 });
//                 if (error) {
//                     console.log("Payment confirmation error " + error.message);
//                 } else {
//                     console.log("Payment successful");
//                 }
//             }
//         } catch (error) {

//         }

//     }
//     return (
//         <View style={styles.container}>
//             <TextInput autoCapitalize='none'
//                 placeholder='Email'
//                 keyboardType='email-address'
//                 value={email!}
//                 onChangeText={text => setEmail(text)}
//                 style={[styles.input, { height: 40, borderColor: 'gray', borderWidth: 1 }]}
//             />
//             <CardField
//                 placeholders={{
//                     number: '4242 4242 4242 4242',
//                 }}
//                 style={styles.cardContainer}
//                 cardStyle={styles.cardStyle}
//                 onCardChange={(card) => setCardDetail(card)}
//             />
//             <TouchableOpacity style={[styles.button]} onPress={handlePayment} disabled={loading}>
//                 <Text style={styles.buttonText}>Pay</Text>
//             </TouchableOpacity>
//         </View>
//     )
// }
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#fefefe',
//         paddingHorizontal: 24,
//         paddingTop: 60,
//     },

//     heading: {
//         fontSize: 24,
//         fontWeight: '700',
//         marginBottom: 24,
//         color: '#1e1e1e',
//         textAlign: 'center',
//     },

//     input: {
//         height: 48,
//         borderColor: '#d1d5db',
//         borderWidth: 1,
//         borderRadius: 10,
//         paddingHorizontal: 12,
//         marginBottom: 16,
//         fontSize: 16,
//         backgroundColor: '#fff',
//     },

//     cardContainer: {
//         height: 50,
//         marginVertical: 20,
//         borderWidth: 1,
//         borderColor: '#ccc',
//         borderRadius: 8,
//         backgroundColor: '#fff',
//     },
//     cardStyle: {
//         backgroundColor: '#f9f9f9',
//         color: 'black',
//         fontSize: 16,
//         borderRadius: 4,
//     },

//     errorText: {
//         color: '#dc2626',
//         fontSize: 14,
//         marginBottom: 10,
//         textAlign: 'center',
//     },

//     button: {
//         backgroundColor: '#2563eb',
//         paddingVertical: 14,
//         borderRadius: 10,
//         alignItems: 'center',
//         marginTop: 10,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 4,
//         elevation: 3,
//     },

//     buttonText: {
//         color: '#fff',
//         fontSize: 16,
//         fontWeight: '600',
//         textTransform: 'uppercase',
//     },

//     loadingOverlay: {
//         ...StyleSheet.absoluteFillObject,
//         backgroundColor: 'rgba(0,0,0,0.4)',
//         justifyContent: 'center',
//         alignItems: 'center',
//     },

//     successText: {
//         color: '#16a34a',
//         fontSize: 16,
//         textAlign: 'center',
//         marginTop: 16,
//     },

//     divider: {
//         height: 1,
//         backgroundColor: '#e5e7eb',
//         marginVertical: 24,
//     },

//     label: {
//         fontSize: 14,
//         fontWeight: '500',
//         marginBottom: 4,
//         color: '#374151',
//     },
// });


// export default Stripe