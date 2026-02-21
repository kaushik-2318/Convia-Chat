import { cn } from '@/lib/utils';
import React from 'react';
import { MotionDiv } from '../common/MotionWrapper';
import { Link } from 'react-router-dom';
import { Button } from '@heroui/button';

export default function SocialButton({ href, icon, className }) {
  return (
    <MotionDiv
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            type: 'spring',
            stiffness: 200,
          },
        },
      }}
    >
      <Link to={href} target="_blank">
        <Button
          className={cn('h-10 w-10 rounded-full p-0 duration-300 hover:scale-110', className)}
        >
          {icon}
        </Button>
      </Link>
    </MotionDiv>
  );
}
