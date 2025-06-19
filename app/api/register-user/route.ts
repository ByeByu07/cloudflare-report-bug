import { NextRequest, NextResponse } from 'next/server';
import { addDays } from 'date-fns';
import jwt from 'jsonwebtoken';
import { AccountType } from '@/interface/account-type';
import { getDb } from '@/lib/db';

export const POST = async (request: NextRequest) => {
  try {
    const prismaClient = getDb();

    // Parse the request body
    const { email } : { email: string } = await request.json();

    console.log(email)

    // Validate the email
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { success: false, message: 'Invalid email address' },
        { status: 400 }
      );
    }

  //   // Check if user already exists
    const existingUser = await prismaClient.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // User already exists, return their current status
      return NextResponse.json({
        success: true,
        message: 'User already registered',
        data: {
          user: {
            email: existingUser.email,
            type_account: existingUser.type_account as AccountType,
            expired_at: existingUser.expired_at,
            created_at: existingUser.created_at,
            updated_at: existingUser.updated_at,
          },
        },
      });
    }

  //   // Set expiration date for free trial (14 days from now)
    const trialExpiryDate = addDays(new Date(), 14);

  //   // Create a new user
    const newUser = await prismaClient.user.create({
      data: {
        email,
        type_account: 'free' as AccountType,
        expired_at: trialExpiryDate,
        // created_at and updated_at are handled automatically by Prisma
      },
    });

    const user = {
      user_id: newUser.id,
      email: newUser.email,
      type_account: newUser.type_account as AccountType,
      expired_at: newUser.expired_at,
      created_at: newUser.created_at,
      updated_at: newUser.updated_at,
    }

    const token = jwt.sign(user, process.env.JWT_SECRET!, { expiresIn: '30d' });

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'User registered successfully',
      data: {
        token,
      }
    });
  } catch (error) {
    console.error('Error registering user:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'An error occurred while registering the user',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
