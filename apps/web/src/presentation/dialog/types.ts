export type ConfirmDialogRequest = {
  readonly type: 'confirm';
  readonly id: string;
  readonly title: string;
  readonly message: string;
  readonly confirmLabel?: string;
  readonly cancelLabel?: string;
};

export type DialogRequest = ConfirmDialogRequest;

export type DialogContextValue = {
  readonly activeDialog: DialogRequest | null;
  readonly openConfirmDialog: (
    request: Omit<ConfirmDialogRequest, 'type'>,
    onConfirm: () => void,
  ) => void;
  readonly closeDialog: () => void;
  readonly confirmDialog: () => void;
};
