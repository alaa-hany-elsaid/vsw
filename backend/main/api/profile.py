from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from ..serializer import ProfileSerializer


class ProfileAPIView(RetrieveUpdateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = ProfileSerializer

    def retrieve(self, req, *args, **kwargs):
        serializer = self.serializer_class(req.user)
        return Response({"data":  serializer.data}, status=status.HTTP_200_OK)

    def update(self, req, *args, **kwargs):
        serializer = self.serializer_class(req.user, data=req.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"data":  serializer.data})
        else:
            return Response({"detail": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
