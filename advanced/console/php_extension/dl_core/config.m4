PHP_ARG_ENABLE(dl_core, Enable test support)

if test "$PHP_DL_CORE" = "yes"; then
   AC_DEFINE(HAVE_DL_CORE, 1, [You have dl_core extension])
   PHP_NEW_EXTENSION(dl_core, dl_core.c, $ext_shared)
fi
