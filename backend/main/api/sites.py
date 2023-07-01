import math
from datetime import datetime

from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from ..models import Site
from ..serializer import SiteSerializer


class Sites(generics.GenericAPIView):
    serializer_class = SiteSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return Site.objects.filter(self.request.user)

    def get(self, request):
        page_num = int(request.GET.get("page", 1))
        limit_num = int(request.GET.get("limit", 10))
        start_num = (page_num - 1) * limit_num
        end_num = limit_num * page_num
        search_param = request.GET.get("search")
        sites = Site.objects.filter(user=request.user)
        total_sites = sites.count()
        if search_param:
            sites = sites.get(Q(baseURL__icontains=search_param) | Q(note__icontains=search_param))
        serializer = self.serializer_class(sites[start_num:end_num], many=True)
        return Response({
            "total": total_sites,
            "page": page_num,
            "last_page": math.ceil(total_sites / limit_num),
            "data": serializer.data
        })

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.validated_data['updatedAt'] = datetime.now()
        serializer.validated_data['createdAt'] = datetime.now()
        serializer.validated_data['user_id'] = request.user.id
        serializer.save()
        return Response({"data": serializer.data}, status=status.HTTP_201_CREATED)


class SiteDetail(generics.GenericAPIView):
    serializer_class = SiteSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return Site.objects.filter(user=self.request.user)

    def get_site(self, pk):
        return get_object_or_404(Site, pk=pk)

    def get(self, request, pk):
        site = self.get_site(pk=pk)
        serializer = self.serializer_class(site)
        return Response({"data":  serializer.data})

    def patch(self, request, pk):
        site = self.get_site(pk)
        serializer = self.serializer_class(
            site, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.validated_data['updatedAt'] = datetime.now()
        serializer.save()
        return Response({"data": serializer.data})

    def delete(self, request, pk):
        site = self.get_site(pk)
        site.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def check_site(req, site_id):
    pass


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_key(req, site_id):
    pass
