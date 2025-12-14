import { NextResponse } from 'next/server';

let cartItems = [];

export async function POST() {
  try {
    cartItems = [];
    
    return NextResponse.json({
      success: true,
      message: 'Cart cleared successfully',
      cartItems: [],
      totalItems: 0,
      totalPrice: 0,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}