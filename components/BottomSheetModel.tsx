import {
    BottomSheetModalProps,
    BottomSheetModal as GorhomBottomSheetModal
} from '@gorhom/bottom-sheet';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';

export type BottomSheetModalRef = {
    expand: () => void;
    close: () => void;
};

type Props = BottomSheetModalProps & {
    children?: React.ReactNode;
};

const BottomSheetModal = forwardRef<BottomSheetModalRef, Props>(
    ({ children, ...props }, ref) => {
        const bottomSheetRef = useRef<GorhomBottomSheetModal>(null);

        useImperativeHandle(ref, () => ({
            expand: () => {
                bottomSheetRef.current?.present();
            },
            close: () => {
                bottomSheetRef.current?.dismiss();
            },
        }));

        return (
            <GorhomBottomSheetModal ref={bottomSheetRef} {...props}>
                {children}
            </GorhomBottomSheetModal>
        );
    }
);

export default BottomSheetModal;
