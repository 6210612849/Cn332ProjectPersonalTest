from features.models import *
from rest_framework import serializers
from users.models import *
from taggit_serializer.serializers import (TagListSerializerField,
                                           TaggitSerializer)


class OptionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Profile
        fields = ('id', 'email', 'avatar', 'first_name', 'last_name')


class PostSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.email')
    comments = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    created = serializers.DateTimeField(required=False, read_only=True)
    options = serializers.SerializerMethodField()
    tags = TagListSerializerField()

    class Meta:
        model = Post
        fields = ['id', 'title', 'body', 'owner', 'comments', 'created', 'options', 'tags']

    def get_options(self, obj):

        selected_options = Profile.objects.filter(
            email=obj.owner)
        print("hahah", OptionSerializer(selected_options, many=True).data)
        return OptionSerializer(selected_options, many=True).data


class GetPostTagsSerializer(TaggitSerializer, serializers.ModelSerializer):
    tags = TagListSerializerField()

    class Meta:
        model = Post
        fields = ['id', 'title', 'body', 'owner', 'comments', 'created', 'tags']


class CommentSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.email')

    class Meta:
        model = Comment
        fields = ['id', 'body', 'owner', 'post', 'created']


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id','title','status','owner','adviser','Facility','File_url','Detail','progress']


class ProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Progressions
        fields = ['id', 'title','owner', 'project' ,'description','timestamp','review']


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['progress', 'owner', 'status', 'comments', 'timestamp']
